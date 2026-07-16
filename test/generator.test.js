import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  createProjectPlan,
  dateSuffix,
  formatDate,
  validateProject
} from "../src/generator.js";
import { industryBlueprints } from "../src/templates/industry-project.js";

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
  assert.ok(first.huggingFace.dataset.files["README.md"]);
  assert.ok(first.huggingFace.model.files["model.json"]);
  assert.ok(first.files["PORTFOLIO.md"].includes("Job Description Mapping"));
  assert.ok(first.files["PORTFOLIO.md"].includes("Resume-Ready Impact Targets"));
  assert.ok(first.files["ROADMAP.md"].includes("12-Week"));
  assert.ok(first.files["PRODUCTION.md"].includes("Real-World Data Sources"));
  assert.ok(first.files["config/project.json"].includes("hugging_face_tasks"));
});

test("all industry rotations produce complete, runnable projects", async () => {
  const blueprintNames = new Set();
  const baseDate = new Date("2026-07-16T12:00:00Z");

  for (let offset = 0; offset < industryBlueprints.length * 2; offset += 1) {
    const date = new Date(baseDate);
    date.setUTCDate(date.getUTCDate() + offset);
    const project = await createProjectPlan({
      client,
      viewer,
      repositories,
      date
    });

    validateProject(project);
    blueprintNames.add(project.blueprint);
    assert.ok(Object.keys(project.files).length >= 18);
    assert.ok(project.description.length >= 40);
  }

  assert.equal(blueprintNames.size, industryBlueprints.length);
});

test("every generated architecture passes its own tests and evaluation", async () => {
  const baseDate = new Date("2026-07-16T12:00:00Z");

  for (let offset = 0; offset < industryBlueprints.length; offset += 1) {
    const date = new Date(baseDate);
    date.setUTCDate(date.getUTCDate() + offset);
    const project = await createProjectPlan({
      client,
      viewer,
      repositories,
      date
    });
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "industry-project-")
    );

    try {
      for (const [relativePath, content] of Object.entries(project.files)) {
        const destination = path.join(directory, relativePath);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, content);
      }

      const tests = spawnSync(
        "python3",
        ["-m", "unittest", "discover", "-s", "tests"],
        { cwd: directory, encoding: "utf8" }
      );
      assert.equal(
        tests.status,
        0,
        `${project.blueprint}: ${tests.stderr || tests.stdout}`
      );

      const compile = spawnSync("python3", ["-m", "compileall", "-q", "src"], {
        cwd: directory,
        encoding: "utf8"
      });
      assert.equal(
        compile.status,
        0,
        `${project.blueprint}: ${compile.stderr || compile.stdout}`
      );

      const evaluation = spawnSync("python3", ["evaluate.py"], {
        cwd: directory,
        env: {
          ...process.env,
          PYTHONPATH: path.join(directory, "src")
        },
        encoding: "utf8"
      });
      assert.equal(
        evaluation.status,
        0,
        `${project.blueprint}: ${evaluation.stderr || evaluation.stdout}`
      );
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  }
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
