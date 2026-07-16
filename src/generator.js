import { analyzeProfile, GENERATED_TOPIC } from "./analyze.js";
import { createRandom } from "./seed.js";
import { industryProject } from "./templates/industry-project.js";

const templates = [industryProject];

export const formatDate = (date) => date.toISOString().slice(0, 10);

export function dateSuffix(date) {
  return formatDate(date).replaceAll("-", "");
}

export function selectTemplate(date, history = []) {
  const completedDays = Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      86_400_000
  );
  const lastTemplate = history.at(-1)?.template;

  for (let offset = 0; offset < templates.length; offset += 1) {
    const index = (completedDays + offset) % templates.length;
    if (templates[index].name !== lastTemplate || templates.length === 1) {
      return templates[index];
    }
  }

  return templates[completedDays % templates.length];
}

export async function createProjectPlan({
  client,
  viewer,
  repositories,
  date,
  history = []
}) {
  const profile = await analyzeProfile(client, viewer, repositories);
  const template = selectTemplate(date, history);
  const dateText = formatDate(date);
  const random = createRandom(`${viewer.login}:${dateText}:${template.name}`);
  const project = template({
    profile,
    date: dateText,
    suffix: dateSuffix(date),
    random
  });

  return {
    ...project,
    template: template.name,
    topics: [...new Set([...project.topics, GENERATED_TOPIC])].slice(0, 20),
    profile
  };
}

export function validateProject(project) {
  const errors = [];
  const requiredFiles = ["README.md", "LICENSE"];

  if (!/^[a-z0-9][a-z0-9-]{1,98}[a-z0-9]$/.test(project.name)) {
    errors.push(`Invalid repository name: ${project.name}`);
  }

  for (const file of requiredFiles) {
    if (!project.files[file]) errors.push(`Missing required file: ${file}`);
  }

  if (Object.keys(project.files).length < 5) {
    errors.push("Generated project must contain at least five files.");
  }

  if (!project.blueprint || !project.architecture) {
    errors.push("Generated project must declare a blueprint and architecture.");
  }

  for (const requiredFile of [
    "ARCHITECTURE.md",
    "PRODUCTION.md",
    "PORTFOLIO.md",
    "ROADMAP.md",
    "REFERENCES.md",
    "MODEL_CARD.md",
    "DATASET_CARD.md",
    "SECURITY.md",
    "config/project.json",
    "artifacts/model.json",
    "data/train.jsonl",
    "data/test.jsonl"
  ]) {
    if (!project.files[requiredFile]) {
      errors.push(`Missing industry project file: ${requiredFile}`);
    }
  }

  if (!project.huggingFace?.dataset?.files || !project.huggingFace?.model?.files) {
    errors.push("Generated project must include Hugging Face dataset and model artifacts.");
  }

  for (const [path, content] of Object.entries(project.files)) {
    if (!path || path.startsWith("/") || path.includes("..")) {
      errors.push(`Unsafe file path: ${path}`);
    }
    if (typeof content !== "string" || content.length === 0) {
      errors.push(`Empty file: ${path}`);
    }
  }

  if (errors.length) {
    throw new Error(`Project validation failed:\n- ${errors.join("\n- ")}`);
  }

  return project;
}
