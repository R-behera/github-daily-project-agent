import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), "..");

export function publishHuggingFace(project) {
  if (!process.env.HF_TOKEN) {
    return null;
  }

  const tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "daily-project-hf-")
  );
  const manifestPath = path.join(tempDirectory, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        project: project.name,
        dataset: project.huggingFace.dataset,
        model: project.huggingFace.model
      },
      null,
      2
    )}\n`
  );

  try {
    const result = spawnSync(
      "python3",
      [path.join(projectRoot, "scripts", "publish_huggingface.py"), manifestPath],
      {
        cwd: projectRoot,
        env: process.env,
        encoding: "utf8"
      }
    );

    if (result.status !== 0) {
      throw new Error(
        `Hugging Face publishing failed:\n${result.stderr || result.stdout}`
      );
    }

    const lines = result.stdout.trim().split(/\r?\n/);
    return JSON.parse(lines.at(-1));
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}
