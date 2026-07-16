import { json, license, profileSnapshot } from "./shared.js";

export function languageDashboard({ profile, date, suffix }) {
  const name = `language-pulse-${suffix}`;
  const description =
    "An interactive, dependency-free dashboard for exploring a developer's GitHub language mix.";
  const snapshot = profileSnapshot(profile, date);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
    <title>Language Pulse</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <header>
        <p class="kicker">GitHub portfolio signal</p>
        <h1>Language Pulse</h1>
        <p id="summary">Loading public repository data...</p>
      </header>
      <section class="panel">
        <div class="panel-heading">
          <h2>Language profile</h2>
          <button id="sort">Sort alphabetically</button>
        </div>
        <div id="languages" class="language-list"></div>
      </section>
      <section class="panel">
        <h2>Recent repositories</h2>
        <div id="repositories" class="repository-grid"></div>
      </section>
    </main>
    <script src="app.js"></script>
  </body>
</html>
`;

  const styles = `:root {
  --ink: #17241e;
  --muted: #5d6b64;
  --paper: #f3f0e7;
  --card: #fffdf6;
  --line: #cbd3c5;
  --accent: #df5b35;
  --green: #1f7250;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(circle at 15% 0%, #f6c878 0, transparent 28rem),
    linear-gradient(135deg, #f3f0e7, #dce8da);
  font-family: Georgia, "Times New Roman", serif;
  min-height: 100vh;
}

main {
  width: min(1040px, 92vw);
  margin: 0 auto;
  padding: 64px 0;
}

header { margin-bottom: 32px; }

.kicker {
  color: var(--accent);
  font-family: ui-monospace, SFMono-Regular, monospace;
  letter-spacing: .12em;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(3rem, 10vw, 7rem);
  line-height: .9;
  margin: 0 0 24px;
}

.panel {
  background: color-mix(in srgb, var(--card) 92%, transparent);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(38, 55, 46, .12);
  margin-top: 20px;
  padding: 24px;
}

.panel-heading {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

button {
  background: var(--ink);
  border: 0;
  border-radius: 999px;
  color: white;
  cursor: pointer;
  padding: 10px 16px;
}

.language {
  display: grid;
  grid-template-columns: minmax(110px, .7fr) 3fr auto;
  gap: 16px;
  align-items: center;
  margin: 14px 0;
}

.track {
  background: #e1e4d8;
  border-radius: 999px;
  height: 14px;
  overflow: hidden;
}

.fill {
  background: linear-gradient(90deg, var(--green), #65a96f);
  border-radius: inherit;
  height: 100%;
}

.repository-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.repo {
  border-left: 3px solid var(--accent);
  background: #f7f4e9;
  padding: 14px;
}

.repo h3 { margin: 0 0 8px; }
.repo p { color: var(--muted); margin: 0; }

@media (max-width: 620px) {
  main { padding: 36px 0; }
  .language { grid-template-columns: 1fr auto; }
  .track { grid-column: 1 / -1; }
}
`;

  const app = `const data = ${JSON.stringify(snapshot, null, 2)};
const languagesRoot = document.querySelector("#languages");
const repositoriesRoot = document.querySelector("#repositories");
const summary = document.querySelector("#summary");
const sortButton = document.querySelector("#sort");
let alphabetical = false;

summary.textContent =
  \`\${data.developer} has \${data.sourceRepositoryCount} analyzed public repositories and \${data.topLanguages.length} prominent languages.\`;

function renderLanguages() {
  const languages = [...data.topLanguages];
  if (alphabetical) languages.sort((a, b) => a.name.localeCompare(b.name));
  const max = Math.max(...languages.map((language) => language.score), 1);

  languagesRoot.innerHTML = languages.map((language) => \`
    <div class="language">
      <strong>\${language.name}</strong>
      <div class="track"><div class="fill" style="width: \${(language.score / max) * 100}%"></div></div>
      <span>\${language.score.toFixed(1)}</span>
    </div>
  \`).join("");
}

repositoriesRoot.innerHTML = data.recentRepositories.map((repo) => \`
  <article class="repo">
    <h3>\${repo.name}</h3>
    <p>\${repo.description || "No description yet."}</p>
  </article>
\`).join("");

sortButton.addEventListener("click", () => {
  alphabetical = !alphabetical;
  sortButton.textContent = alphabetical ? "Sort by weight" : "Sort alphabetically";
  renderLanguages();
});

renderLanguages();
`;

  const readme = `# Language Pulse

An interactive static dashboard that presents a snapshot of the programming
languages and recent repositories visible on
[${profile.login}'s public GitHub profile](https://github.com/${profile.login}).

Generated on ${date}. No framework, build step, paid service, or API key is
required.

## Run

Open \`index.html\` directly, or serve the directory:

\`\`\`bash
python3 -m http.server 8080
\`\`\`

Then visit [http://localhost:8080](http://localhost:8080).
`;

  return {
    name,
    description,
    topics: ["github", "dashboard", "data-visualization", "vanilla-javascript"],
    files: {
      "index.html": html,
      "styles.css": styles,
      "app.js": app,
      "data/profile-snapshot.json": json(snapshot),
      "README.md": readme,
      "LICENSE": license(profile.login, date.slice(0, 4))
    }
  };
}
