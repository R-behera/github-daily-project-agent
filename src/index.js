#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GitHubClient } from "./github-client.js";
import {
  createProjectPlan,
  formatDate,
  validateProject
} from "./generator.js";
import { publishHuggingFace } from "./huggingface.js";
import { readState, recordRun } from "./state.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const token = process.env.DAILY_AGENT_TOKEN || process.env.GH_TOKEN;
const includePrivate = process.env.INCLUDE_PRIVATE === "true";
const visibility = process.env.REPOSITORY_VISIBILITY || "public";
const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), "..");
const stateFile = path.resolve(
  projectRoot,
  process.env.STATE_FILE || "state/history.json"
);
const now = process.env.GENERATION_DATE
  ? new Date(`${process.env.GENERATION_DATE}T12:00:00Z`)
  : new Date();

if (!token) {
  throw new Error(
    "Set DAILY_AGENT_TOKEN (or GH_TOKEN) to a GitHub token that can read public repositories and create repositories."
  );
}

const client = new GitHubClient(token);
const viewer = await client.getViewer();
const repositories = await client.listOwnedRepositories({ includePrivate });
const state = readState(stateFile);
const date = formatDate(now);

const existingRun = state.runs.find((run) => run.date === date);
if (existingRun && !dryRun && !force) {
  console.log(`Already created ${existingRun.repository} for ${date}.`);
  process.exit(0);
}

const project = validateProject(
  await createProjectPlan({
    client,
    viewer,
    repositories,
    date: now,
    history: state.runs
  })
);

console.log(
  JSON.stringify(
    {
      mode: dryRun ? "dry-run" : "publish",
      owner: viewer.login,
      repository: project.name,
      template: project.template,
      blueprint: project.blueprint,
      architecture: project.architecture,
      files: Object.keys(project.files),
      huggingFace: {
        dataset: project.huggingFace.dataset.name,
        model: project.huggingFace.model.name,
        enabled: Boolean(process.env.HF_TOKEN)
      },
      analyzedPublicRepositories: project.profile.sourceRepositoryCount,
      topLanguages: project.profile.languages.slice(0, 5).map((item) => item.name)
    },
    null,
    2
  )
);

if (dryRun) {
  process.exit(0);
}

let repository;
try {
  repository = await client.getRepository(viewer.login, project.name);
  console.log(`Repository ${repository.full_name} already exists; checking contents.`);
} catch (error) {
  if (error.status !== 404) throw error;
  repository = await client.createRepository({
    name: project.name,
    description: project.description,
    visibility
  });
}

let hasMainBranch = true;
try {
  await client.getRef(viewer.login, project.name);
} catch (error) {
  if (error.status !== 404 && error.status !== 409) throw error;
  hasMainBranch = false;
}

if (!hasMainBranch || repository.size === 0 || force) {
  await client.publishFiles(
    viewer.login,
    project.name,
    project.files,
    `Create ${project.name}`
  );
  await client.setTopics(viewer.login, project.name, project.topics);
} else {
  console.log(`Repository ${repository.full_name} already has content; skipping publish.`);
}

let huggingFace = null;
if (process.env.HF_TOKEN) {
  huggingFace = publishHuggingFace(project);
  console.log(`Published Hugging Face dataset: ${huggingFace.dataset}`);
  console.log(`Published Hugging Face model: ${huggingFace.model}`);
} else if (process.env.HF_REQUIRED === "true") {
  throw new Error("HF_REQUIRED=true but the HF_TOKEN secret is not configured.");
} else {
  console.log("HF_TOKEN is not configured; skipping Hugging Face publishing.");
}

recordRun(stateFile, {
  date,
  repository: repository.full_name,
  url: repository.html_url,
  template: project.template,
  blueprint: project.blueprint,
  architecture: project.architecture,
  huggingFace,
  createdAt: new Date().toISOString()
});

console.log(`Published ${repository.html_url}`);
