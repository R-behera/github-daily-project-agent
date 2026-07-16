#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GitHubClient } from "./github-client.js";
import {
  createProjectPlan,
  formatDate,
  validateProject
} from "./generator.js";
import { readState, recordRun } from "./state.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
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
if (existingRun && !dryRun) {
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
      files: Object.keys(project.files),
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
  console.log(`Repository ${repository.full_name} already exists; recording it.`);
} catch (error) {
  if (!error.message.includes("Not Found")) throw error;
  repository = await client.createRepository({
    name: project.name,
    description: project.description,
    visibility
  });

  await client.publishFiles(
    viewer.login,
    project.name,
    project.files,
    `Create ${project.name}`
  );
  await client.setTopics(viewer.login, project.name, project.topics);
}

recordRun(stateFile, {
  date,
  repository: repository.full_name,
  url: repository.html_url,
  template: project.template,
  createdAt: new Date().toISOString()
});

console.log(`Published ${repository.html_url}`);
