import { json, license, profileSnapshot } from "./shared.js";

export function repoHealthCli({ profile, date, suffix }) {
  const name = `repo-health-${suffix}`;
  const description =
    "A dependency-free CLI that checks GitHub repositories for practical maintenance signals.";

  const packageJson = {
    name,
    version: "1.0.0",
    description,
    type: "module",
    bin: {
      "repo-health": "./src/index.js"
    },
    scripts: {
      start: "node src/index.js",
      test: "node --test"
    },
    engines: {
      node: ">=20"
    },
    license: "MIT"
  };

  const source = `#!/usr/bin/env node
const owner = process.argv[2] || "${profile.login}";
const token = process.env.GITHUB_TOKEN;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "repo-health-cli",
  ...(token ? { Authorization: \`Bearer \${token}\` } : {})
};

const response = await fetch(
  \`https://api.github.com/users/\${encodeURIComponent(owner)}/repos?per_page=100&sort=updated\`,
  { headers }
);

if (!response.ok) {
  throw new Error(\`GitHub API returned \${response.status}\`);
}

const repositories = (await response.json()).filter((repo) => !repo.fork);

const score = (repo) => {
  let value = 25;
  const checks = [];

  if (repo.description) {
    value += 15;
    checks.push("description");
  }
  if (repo.license) {
    value += 15;
    checks.push("license");
  }
  if (repo.has_issues) {
    value += 10;
    checks.push("issues");
  }
  if (repo.topics?.length) {
    value += 15;
    checks.push("topics");
  }
  if (repo.homepage) {
    value += 10;
    checks.push("homepage");
  }
  if (!repo.archived) {
    value += 10;
    checks.push("active");
  }

  return { name: repo.name, score: Math.min(value, 100), checks };
};

const report = repositories.map(score).sort((a, b) => b.score - a.score);
console.table(report);

const average = report.length
  ? Math.round(report.reduce((sum, repo) => sum + repo.score, 0) / report.length)
  : 0;

console.log(\`\\n\${owner}: \${report.length} repositories, average health score \${average}/100\`);
`;

  const test = `import test from "node:test";
import assert from "node:assert/strict";

test("Node has the fetch API required by the CLI", () => {
  assert.equal(typeof fetch, "function");
});
`;

  const readme = `# Repo Health CLI

A small, dependency-free Node.js command-line tool that reviews public GitHub
repositories for useful maintenance signals such as descriptions, licenses,
topics, issue tracking, and project links.

This project was generated on ${date} from public development patterns on
[${profile.login}'s GitHub profile](https://github.com/${profile.login}).

## Run

\`\`\`bash
node src/index.js ${profile.login}
\`\`\`

For higher GitHub API limits:

\`\`\`bash
GITHUB_TOKEN=your_token node src/index.js ${profile.login}
\`\`\`

## Test

\`\`\`bash
npm test
\`\`\`

## Notes

The score is a transparent project-hygiene heuristic, not a judgment of code
quality or security.
`;

  return {
    name,
    description,
    topics: ["github", "cli", "developer-tools", "repository-health"],
    files: {
      "package.json": json(packageJson),
      "src/index.js": source,
      "test/smoke.test.js": test,
      "data/profile-snapshot.json": json(profileSnapshot(profile, date)),
      "README.md": readme,
      "LICENSE": license(profile.login, date.slice(0, 4)),
      ".gitignore": ".env\nnode_modules/\n"
    }
  };
}
