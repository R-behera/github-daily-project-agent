import { json, license, profileSnapshot } from "./shared.js";

export function activityReport({ profile, date, suffix }) {
  const name = `github-activity-report-${suffix}`;
  const description =
    "A standard-library Python tool that turns public GitHub events into a readable Markdown report.";

  const source = `#!/usr/bin/env python3
"""Create a Markdown report from a user's public GitHub events."""

from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


def fetch_events(username: str) -> list[dict]:
    request = urllib.request.Request(
        f"https://api.github.com/users/{username}/events/public?per_page=100",
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "github-activity-report",
            **(
                {"Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}"}
                if os.environ.get("GITHUB_TOKEN")
                else {}
            ),
        },
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)


def build_report(username: str, events: list[dict]) -> str:
    event_counts = Counter(event["type"] for event in events)
    repository_counts = Counter(event["repo"]["name"] for event in events)
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    lines = [
        f"# Public GitHub Activity: {username}",
        "",
        f"Generated {generated} from {len(events)} recent public events.",
        "",
        "## Event Types",
        "",
        "| Event | Count |",
        "| --- | ---: |",
    ]
    lines.extend(
        f"| {event_type.removesuffix('Event')} | {count} |"
        for event_type, count in event_counts.most_common()
    )
    lines.extend(["", "## Most Active Repositories", "", "| Repository | Events |", "| --- | ---: |"])
    lines.extend(
        f"| [{repository}](https://github.com/{repository}) | {count} |"
        for repository, count in repository_counts.most_common(10)
    )
    return "\\n".join(lines) + "\\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("username", nargs="?", default="${profile.login}")
    parser.add_argument("--output", default="report.md")
    args = parser.parse_args()

    try:
        events = fetch_events(args.username)
    except urllib.error.HTTPError as error:
        raise SystemExit(f"GitHub API returned {error.code}: {error.reason}") from error

    Path(args.output).write_text(
        build_report(args.username, events),
        encoding="utf-8",
    )
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
`;

  const test = `import unittest

from main import build_report


class ReportTests(unittest.TestCase):
    def test_build_report_counts_events(self):
        events = [
            {"type": "PushEvent", "repo": {"name": "example/demo"}},
            {"type": "PushEvent", "repo": {"name": "example/demo"}},
            {"type": "IssuesEvent", "repo": {"name": "example/other"}},
        ]
        report = build_report("example", events)
        self.assertIn("| Push | 2 |", report)
        self.assertIn("| Issues | 1 |", report)


if __name__ == "__main__":
    unittest.main()
`;

  const readme = `# GitHub Activity Report

A dependency-free Python utility that fetches recent public GitHub events and
writes a compact Markdown activity report.

Generated on ${date} using public portfolio signals from
[${profile.login}](https://github.com/${profile.login}).

## Run

\`\`\`bash
python3 main.py ${profile.login} --output report.md
\`\`\`

Optional authentication raises the API rate limit:

\`\`\`bash
GITHUB_TOKEN=your_token python3 main.py ${profile.login}
\`\`\`

## Test

\`\`\`bash
python3 -m unittest
\`\`\`
`;

  return {
    name,
    description,
    topics: ["python", "github-api", "reporting", "developer-tools"],
    files: {
      "main.py": source,
      "test_main.py": test,
      "data/profile-snapshot.json": json(profileSnapshot(profile, date)),
      "README.md": readme,
      "LICENSE": license(profile.login, date.slice(0, 4)),
      ".gitignore": "__pycache__/\n*.pyc\n.env\nreport.md\n"
    }
  };
}
