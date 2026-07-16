# GitHub Daily Industry AI Project Agent

A zero-paid-LLM automation that creates one independent, production-oriented AI
project repository every day. Each project includes architecture, runnable
code, tests, a synthetic dataset, a trained lightweight model artifact,
evaluation, CI, Docker support, model documentation, and dataset documentation.

When Hugging Face credentials are configured, the same daily run also creates
a separate Hugging Face dataset repository and model repository.

## Daily Output

One daily run produces three linked repositories:

1. A GitHub source repository containing the complete project.
2. A Hugging Face dataset repository with JSONL data and a dataset card.
3. A Hugging Face model repository with a trained baseline and model card.

Every GitHub project is independent. It does not add unrelated files to an
older project repository.

## Project Catalog

The agent rotates through industry-relevant architectures:

- Clinical RAG safety gateway
- Agentic incident-response orchestrator
- Hybrid semantic-search service
- Knowledge-graph risk engine
- RAG evaluation lab
- Production AI observability monitor
- Applied ML support router
- Multimodal document-retrieval baseline
- Audio event-triage baseline
- Contextual-bandit decision simulator

Projects cover LLM-agent architecture, RAG, healthcare AI, applied machine
learning, knowledge graphs, semantic search, multimodal retrieval, evaluation,
observability, audio ML, and reinforcement learning.

## What Every GitHub Repository Contains

- `README.md` with purpose, quick start, and safety limitations
- `ARCHITECTURE.md` with a Mermaid system diagram
- `src/` Python inference pipeline
- `train.py` reproducible baseline trainer
- `evaluate.py` held-out evaluation and release gate
- `tests/` unit tests
- `data/train.jsonl` and `data/test.jsonl`
- `artifacts/model.json` trained transparent model
- `MODEL_CARD.md` and `DATASET_CARD.md`
- `SECURITY.md`
- Dockerfile
- GitHub Actions CI
- MIT source-code license

The generated baseline uses standard-library Python. It is intentionally small
enough to train and test for free on GitHub Actions.

## Hugging Face Publishing

Hugging Face publishing requires:

- An account-level write token stored as the `HF_TOKEN` Actions secret.
- An optional `HF_NAMESPACE` repository variable containing your username or
  an organization in which you have write access.

If `HF_NAMESPACE` is empty, artifacts are published under the authenticated
Hugging Face user account.

An organization cannot be joined automatically without an invitation, an
approved join request, or membership granted by an organization administrator.

The generated datasets are small and synthetic. Their cards state provenance,
intended use, limitations, and risks. The generated model repositories contain
transparent baselines, not unsupported claims of state-of-the-art performance.

## Cost

The design avoids paid services:

- Public GitHub Actions runner
- No paid LLM API
- No hosted database
- Standard-library generated projects
- Small public Hugging Face artifacts

Hugging Face public storage is best-effort and must be used responsibly. This
agent intentionally creates small artifacts with documentation rather than
large checkpoints.

## Schedule

The controller runs every day at 9:17 AM in `America/New_York`.

GitHub can delay scheduled jobs during busy periods. The controller records
each successful run in `state/history.json` to prevent duplicate daily output.

## Local Validation

```bash
npm test
DAILY_AGENT_TOKEN="$(gh auth token)" npm run dry-run
```

A dry run analyzes public GitHub metadata and validates the planned project
without creating any repositories.

## GitHub Configuration

| Name | Type | Purpose |
| --- | --- | --- |
| `DAILY_AGENT_TOKEN` | Actions secret | Creates and writes GitHub repositories |
| `HF_TOKEN` | Actions secret | Creates Hugging Face models and datasets |
| `HF_NAMESPACE` | Repository variable | Hugging Face username or organization |
| `HF_REQUIRED` | Repository variable | Fail the run if HF publishing is unavailable |
| `INCLUDE_PRIVATE` | Environment setting | Defaults to `false` to prevent metadata leaks |
| `REPOSITORY_VISIBILITY` | Environment setting | Defaults to `public` |

## Safety Boundaries

- Only public GitHub metadata is analyzed by default.
- Healthcare examples are synthetic and cannot be used for diagnosis.
- No real personal, patient, customer, audio, image, or financial records are
  included.
- Synthetic evaluation scores verify code behavior, not production quality.
- High-impact agent actions require explicit approval in the generated design.
- Generated projects should be reviewed and maintained rather than treated as
  disposable repository volume.
