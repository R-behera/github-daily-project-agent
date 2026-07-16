import fs from "node:fs";
import path from "node:path";

export function readState(filePath) {
  if (!fs.existsSync(filePath)) return { runs: [] };

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return {
    runs: Array.isArray(parsed.runs) ? parsed.runs : []
  };
}

export function recordRun(filePath, run) {
  const state = readState(filePath);
  const withoutDate = state.runs.filter((item) => item.date !== run.date);
  const updated = {
    runs: [...withoutDate, run].slice(-365)
  };

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(updated, null, 2)}\n`);
}
