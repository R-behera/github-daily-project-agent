import test from "node:test";
import assert from "node:assert/strict";
import {
  createProjectPlan,
  dateSuffix,
  formatDate,
  validateProject
} from "../src/generator.js";

const viewer = {
  login: "example",
  name: "Example Developer",
  bio: "Builds useful software"
};

const repositories = [
  {
    name: "dashboard",
    fork: false,
    private: false,
    language: "JavaScript",
    description: "A monitoring dashboard",
    topics: ["dashboard", "monitoring"],
    stargazers_count: 4,
    updated_at: "2026-07-15T00:00:00Z"
  },
  {
    name: "reporter",
    fork: false,
    private: false,
    language: "Python",
    description: "Reporting automation",
    topics: ["automation", "reporting"],
    stargazers_count: 2,
    updated_at: "2026-07-14T00:00:00Z"
  }
];

const client = {
  async getLanguages(_owner, repository) {
    return repository === "dashboard"
      ? { JavaScript: 5000, CSS: 2000 }
      : { Python: 7000 };
  }
};

test("formats dates consistently", () => {
  const date = new Date("2026-07-16T12:00:00Z");
  assert.equal(formatDate(date), "2026-07-16");
  assert.equal(dateSuffix(date), "20260716");
});

test("creates a deterministic valid project", async () => {
  const date = new Date("2026-07-16T12:00:00Z");
  const first = await createProjectPlan({
    client,
    viewer,
    repositories,
    date
  });
  const second = await createProjectPlan({
    client,
    viewer,
    repositories,
    date
  });

  validateProject(first);
  assert.equal(first.name, second.name);
  assert.deepEqual(first.files, second.files);
  assert.ok(first.topics.includes("daily-agent-generated"));
  assert.ok(first.files["README.md"].includes("example"));
});

test("all template rotations produce complete projects", async () => {
  const templateNames = new Set();

  for (let day = 16; day <= 23; day += 1) {
    const project = await createProjectPlan({
      client,
      viewer,
      repositories,
      date: new Date(`2026-07-${day}T12:00:00Z`)
    });

    validateProject(project);
    templateNames.add(project.template);
    assert.ok(Object.keys(project.files).length >= 5);
    assert.ok(project.description.length >= 40);
  }

  assert.equal(templateNames.size, 4);
});

test("rejects unsafe project files", () => {
  assert.throws(
    () =>
      validateProject({
        name: "valid-project",
        files: {
          "README.md": "readme",
          LICENSE: "license",
          "../secret": "bad",
          "src/a.js": "a",
          "src/b.js": "b"
        }
      }),
    /Unsafe file path/
  );
});
