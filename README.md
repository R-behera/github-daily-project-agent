# GitHub Daily Project Agent

A zero-paid-API automation that studies broad patterns from your public GitHub
repositories and publishes one small, original project repository each day.

It runs entirely on GitHub Actions and uses deterministic local templates. It
does not call OpenAI, Anthropic, Gemini, or any other paid AI service.

## What It Does

Every day the agent:

1. Reads your public repositories through the GitHub API.
2. Measures language, topic, description, and recent-repository patterns.
3. Selects a project type from a rotating template catalog.
4. Generates at least five useful project files.
5. Validates paths and required documentation.
6. Creates one public repository with the date in its name.
7. Records the successful run to prevent duplicates.

Current project types include:

- Repository health CLI
- Interactive language dashboard
- Python public-activity report
- Portfolio-based project idea board

## Cost

The agent is designed to cost $0:

- No paid AI model or API.
- No hosted database.
- No external scheduler.
- No package dependencies.
- Public GitHub repositories use free GitHub-hosted Actions.

GitHub can delay scheduled jobs during busy periods. Scheduled workflows in
inactive public repositories may be disabled after 60 days, so the workflow
records successful daily runs in this controller repository.

## Security

The workflow uses only public repository metadata by default:

```text
INCLUDE_PRIVATE=false
```

This prevents private repository names, descriptions, languages, or topics
from being copied into public generated projects.

The built-in `GITHUB_TOKEN` cannot create repositories outside the controller
repository. Store a separate token in the `DAILY_AGENT_TOKEN` Actions secret.
The token must be able to create repositories and write repository contents.

Never place the token in source code or commit it to Git.

## Local Test

The project has no dependencies:

```bash
npm test
DAILY_AGENT_TOKEN="$(gh auth token)" npm run dry-run
```

The dry run reads your public GitHub metadata and prints the planned repository
without creating it.

## Run Manually

Open the repository's **Actions** tab, select **Create daily project**, and use
**Run workflow**.

To test without publishing, enable the `dry_run` option.

## Schedule

The workflow runs daily at 9:17 AM in `America/New_York`. The non-round minute
reduces the chance of GitHub Actions scheduling congestion.

Edit `.github/workflows/daily-project.yml` to change the schedule.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `DAILY_AGENT_TOKEN` | required | Token stored as an Actions secret |
| `INCLUDE_PRIVATE` | `false` | Whether private metadata may be analyzed |
| `REPOSITORY_VISIBILITY` | `public` | Visibility of generated repositories |
| `STATE_FILE` | `state/history.json` | Daily deduplication history |
| `GENERATION_DATE` | current date | Fixed date for local testing |

## Project Structure

```text
.
├── .github/workflows/daily-project.yml
├── src/
│   ├── templates/
│   ├── analyze.js
│   ├── generator.js
│   ├── github-client.js
│   ├── index.js
│   ├── seed.js
│   └── state.js
├── state/history.json
├── test/generator.test.js
└── package.json
```

## Responsible Use

One repository per day can still create a lot of public material. Keep the
generated repositories useful, review them periodically, and archive or delete
projects you do not want to maintain.
