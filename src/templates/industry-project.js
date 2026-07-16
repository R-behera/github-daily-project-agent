import { json, license, slugify } from "./shared.js";

export const industryBlueprints = [
  {
    id: "clinical-rag-safety",
    slug: "clinical-rag-safety-gateway",
    title: "Clinical RAG Safety Gateway",
    domain: "healthcare-ai",
    mode: "retrieval",
    taskCategory: "question-answering",
    description:
      "A citation-first healthcare RAG gateway with abstention, evidence checks, and synthetic clinical policy data.",
    problem:
      "Clinical assistants need retrieval, source attribution, and explicit abstention before answers reach care teams.",
    labels: ["medication-policy", "triage-policy", "privacy-policy"],
    components: [
      "Policy document ingestion",
      "Hybrid token retrieval",
      "Evidence sufficiency gate",
      "Abstention and escalation policy",
      "Citation and safety evaluation"
    ],
    metrics: ["retrieval_accuracy", "abstention_coverage", "citation_coverage"],
    risks:
      "Synthetic educational data only. The baseline must not provide diagnosis, treatment, or emergency medical advice.",
    examples: [
      ["When should medication reconciliation be completed?", "medication-policy", "Complete medication reconciliation during admission, transfer, and discharge.", "med-policy-01"],
      ["What requires pharmacist review?", "medication-policy", "High-risk medication changes require pharmacist review before release.", "med-policy-02"],
      ["When should urgent symptoms be escalated?", "triage-policy", "Urgent or life-threatening symptoms require immediate escalation to qualified clinical staff.", "triage-01"],
      ["Can the assistant diagnose a patient?", "triage-policy", "The assistant must abstain from diagnosis and direct the user to a qualified clinician.", "triage-02"],
      ["How should patient identifiers be handled?", "privacy-policy", "Use the minimum necessary patient information and never place identifiers in public logs.", "privacy-01"],
      ["Can protected health data be used in test prompts?", "privacy-policy", "Use synthetic or properly de-identified records for testing and evaluation.", "privacy-02"]
    ]
  },
  {
    id: "agentic-incident-response",
    slug: "agentic-incident-response",
    title: "Agentic Incident Response Orchestrator",
    domain: "llm-agents",
    mode: "agent",
    taskCategory: "text-classification",
    description:
      "A constrained incident-response agent that routes alerts to tools through auditable plans and approval gates.",
    problem:
      "Production teams need agentic automation without allowing an LLM-style planner to execute unsafe remediation.",
    labels: ["inspect-logs", "query-metrics", "open-ticket", "request-approval"],
    components: [
      "Intent and tool router",
      "Read-only investigation tools",
      "State-machine planner",
      "Human approval checkpoint",
      "Audit event recorder"
    ],
    metrics: ["tool_routing_accuracy", "unsafe_action_block_rate", "plan_completion"],
    risks:
      "The generated agent uses simulated tools. Production integrations must enforce least privilege and human approval.",
    examples: [
      ["Find the error messages around the deployment timestamp", "inspect-logs", "Search structured logs for correlated exceptions.", "agent-01"],
      ["Show latency and error rate for the checkout service", "query-metrics", "Query service-level telemetry and compare it with baseline.", "agent-02"],
      ["Create a tracked incident for the payment outage", "open-ticket", "Open an incident record with evidence and ownership.", "agent-03"],
      ["Restart the production database", "request-approval", "Destructive or state-changing actions require explicit approval.", "agent-04"],
      ["Inspect stack traces for repeated timeout failures", "inspect-logs", "Group repeated errors and preserve representative traces.", "agent-05"],
      ["Scale the service to twenty replicas", "request-approval", "Capacity changes require an approved remediation plan.", "agent-06"]
    ]
  },
  {
    id: "hybrid-semantic-search",
    slug: "hybrid-semantic-search",
    title: "Hybrid Semantic Search Service",
    domain: "semantic-search",
    mode: "retrieval",
    taskCategory: "sentence-similarity",
    description:
      "A local-first semantic search service combining lexical retrieval, weighted concepts, filters, and offline evaluation.",
    problem:
      "Enterprise search needs explainable retrieval quality when embedding APIs are unavailable, expensive, or restricted.",
    labels: ["architecture", "operations", "security"],
    components: [
      "Document chunking",
      "Lexical and concept-weighted retrieval",
      "Metadata filtering",
      "Result explanation",
      "Recall and ranking evaluation"
    ],
    metrics: ["retrieval_accuracy", "recall_at_3", "mean_reciprocal_rank"],
    risks:
      "The lightweight lexical baseline is reproducible but should be replaced or compared with domain embeddings at scale.",
    examples: [
      ["How is the service architecture organized?", "architecture", "The service separates ingestion, indexing, retrieval, ranking, and API delivery.", "search-01"],
      ["What happens when the index becomes stale?", "operations", "Scheduled refreshes rebuild changed documents and retain the previous healthy index.", "search-02"],
      ["How are access controls applied to results?", "security", "Retrieval filters documents by caller permissions before ranking.", "search-03"],
      ["Where is query ranking implemented?", "architecture", "The ranking layer combines lexical overlap, concept weights, and metadata boosts.", "search-04"],
      ["How do operators detect poor search quality?", "operations", "Offline relevance sets and production click signals track quality regressions.", "search-05"],
      ["Can one user retrieve another team's documents?", "security", "Authorization filters must run before any document content is returned.", "search-06"]
    ]
  },
  {
    id: "knowledge-graph-risk",
    slug: "knowledge-graph-risk-engine",
    title: "Knowledge Graph Risk Engine",
    domain: "knowledge-graphs",
    mode: "graph",
    taskCategory: "feature-extraction",
    description:
      "An explainable knowledge-graph pipeline for entity links, relationship paths, and risk evidence.",
    problem:
      "Risk teams need relationship-level explanations instead of opaque entity scores.",
    labels: ["ownership", "transaction", "location"],
    components: [
      "Entity normalization",
      "Relationship extraction",
      "Adjacency graph construction",
      "Path-based evidence search",
      "Graph quality evaluation"
    ],
    metrics: ["relation_accuracy", "path_coverage", "entity_resolution_precision"],
    risks:
      "All entities are fictional. Real identity or financial data requires governance, consent, and bias review.",
    examples: [
      ["Who controls supplier alpha?", "ownership", "company-alpha controls supplier-alpha", "graph-01"],
      ["Which account paid vendor beta?", "transaction", "account-17 paid vendor-beta", "graph-02"],
      ["Where is warehouse north located?", "location", "warehouse-north located-in region-east", "graph-03"],
      ["Which company owns vendor gamma?", "ownership", "company-delta owns vendor-gamma", "graph-04"],
      ["What transfer connects account 17 and supplier alpha?", "transaction", "account-17 transferred-to supplier-alpha", "graph-05"],
      ["What region contains facility blue?", "location", "facility-blue located-in region-west", "graph-06"]
    ],
    graphEdges: [
      ["company-alpha", "controls", "supplier-alpha"],
      ["account-17", "paid", "vendor-beta"],
      ["warehouse-north", "located-in", "region-east"],
      ["company-delta", "owns", "vendor-gamma"],
      ["account-17", "transferred-to", "supplier-alpha"],
      ["facility-blue", "located-in", "region-west"]
    ]
  },
  {
    id: "rag-evaluation",
    slug: "rag-evaluation-lab",
    title: "RAG Evaluation Lab",
    domain: "ai-evaluation",
    mode: "classifier",
    taskCategory: "text-classification",
    description:
      "A reproducible RAG evaluation harness for retrieval misses, unsupported answers, citation gaps, and abstention errors.",
    problem:
      "RAG systems often ship without a stable regression set or failure taxonomy.",
    labels: ["retrieval-miss", "unsupported-answer", "citation-gap", "abstention-error"],
    components: [
      "Versioned evaluation cases",
      "Failure-mode classifier",
      "Retrieval and answer metrics",
      "Threshold-based release gate",
      "Markdown evaluation report"
    ],
    metrics: ["failure_class_accuracy", "citation_coverage", "release_gate_pass_rate"],
    risks:
      "Synthetic cases validate the harness, not a production RAG system. Teams must add representative domain examples.",
    examples: [
      ["The expected document never appeared in the top results", "retrieval-miss", "Relevant evidence was absent from retrieved context.", "eval-01"],
      ["The response makes a claim not present in any source", "unsupported-answer", "Answer faithfulness failed despite available context.", "eval-02"],
      ["The answer is correct but has no source reference", "citation-gap", "Citation coverage failed for an otherwise supported answer.", "eval-03"],
      ["The system answered even though evidence was insufficient", "abstention-error", "The answer policy should have triggered abstention.", "eval-04"],
      ["Ranking placed irrelevant policy above the correct section", "retrieval-miss", "The relevant item fell outside the accepted retrieval window.", "eval-05"],
      ["The response invented a product limit", "unsupported-answer", "The generated claim cannot be traced to retrieved evidence.", "eval-06"]
    ]
  },
  {
    id: "ai-observability",
    slug: "production-ai-observability",
    title: "Production AI Observability Monitor",
    domain: "ai-observability",
    mode: "classifier",
    taskCategory: "text-classification",
    description:
      "An observability pipeline that classifies AI trace failures and produces release-ready reliability reports.",
    problem:
      "Production AI teams need trace-level signals for latency, token growth, tool failures, and low-quality outputs.",
    labels: ["latency-regression", "token-spike", "tool-failure", "quality-regression"],
    components: [
      "Structured trace ingestion",
      "Failure taxonomy",
      "Deterministic anomaly classifier",
      "Service-level summaries",
      "Release regression gate"
    ],
    metrics: ["failure_class_accuracy", "alert_precision", "trace_coverage"],
    risks:
      "Thresholds are demonstration defaults and need calibration against each production workload.",
    examples: [
      ["Request latency rose above the service objective", "latency-regression", "End-to-end latency exceeded the approved percentile threshold.", "trace-01"],
      ["Prompt tokens doubled after a template change", "token-spike", "Token consumption increased beyond the cost and context baseline.", "trace-02"],
      ["The retrieval tool returned a timeout exception", "tool-failure", "A required external tool failed during execution.", "trace-03"],
      ["Grounded answer score dropped after deployment", "quality-regression", "Evaluation quality regressed relative to the release baseline.", "trace-04"],
      ["The agent stayed within quality limits but became slower", "latency-regression", "Performance changed without a matching quality improvement.", "trace-05"],
      ["Search calls failed with repeated connection errors", "tool-failure", "Dependency errors prevented the workflow from completing.", "trace-06"]
    ]
  },
  {
    id: "support-routing-ml",
    slug: "support-routing-ml",
    title: "Applied ML Support Router",
    domain: "applied-machine-learning",
    mode: "classifier",
    taskCategory: "text-classification",
    description:
      "A transparent text-classification baseline for routing support requests with confidence and escalation.",
    problem:
      "Support operations need reproducible routing models that expose confidence and defer uncertain cases.",
    labels: ["billing", "technical", "account-access", "security"],
    components: [
      "Synthetic labeled dataset",
      "Prototype text classifier",
      "Confidence threshold",
      "Human escalation queue",
      "Accuracy and coverage report"
    ],
    metrics: ["classification_accuracy", "automation_coverage", "escalation_precision"],
    risks:
      "Synthetic tickets do not represent every user population or language. Production training data needs consent and bias analysis.",
    examples: [
      ["I was charged twice for the same subscription", "billing", "Duplicate charge investigation request.", "ticket-01"],
      ["The API returns a timeout after deployment", "technical", "Technical failure affecting an integration.", "ticket-02"],
      ["I cannot reset my password or access my account", "account-access", "Authentication and account recovery request.", "ticket-03"],
      ["I received a suspicious login notification", "security", "Potential account compromise or unauthorized access.", "ticket-04"],
      ["My invoice has the wrong tax amount", "billing", "Invoice calculation or billing documentation issue.", "ticket-05"],
      ["The SDK fails to parse the response body", "technical", "Client library behavior requires engineering review.", "ticket-06"]
    ]
  },
  {
    id: "multimodal-document-retrieval",
    slug: "multimodal-document-retrieval",
    title: "Multimodal Document Retrieval Baseline",
    domain: "multimodal-ai",
    mode: "retrieval",
    taskCategory: "visual-document-retrieval",
    description:
      "A document-retrieval baseline that combines OCR text, layout labels, image captions, and metadata evidence.",
    problem:
      "Business documents contain meaning in text, tables, layout, and imagery that text-only retrieval can miss.",
    labels: ["invoice", "technical-diagram", "policy-form"],
    components: [
      "Modality-aware document schema",
      "OCR and caption feature fusion",
      "Metadata-aware retrieval",
      "Evidence presentation",
      "Modality ablation evaluation"
    ],
    metrics: ["retrieval_accuracy", "modality_coverage", "recall_at_3"],
    risks:
      "The starter dataset contains synthetic textual modality descriptors, not sensitive scanned documents.",
    examples: [
      ["Find the invoice with a shipping surcharge table", "invoice", "OCR total 1480; table shipping surcharge 80; image company seal.", "doc-01"],
      ["Locate the architecture diagram showing a queue", "technical-diagram", "Caption service diagram; labels producer queue consumer.", "doc-02"],
      ["Find the signed privacy exception request", "policy-form", "OCR privacy exception; layout signature block approved.", "doc-03"],
      ["Which invoice contains a tax adjustment?", "invoice", "OCR invoice 184; table subtotal tax adjustment final total.", "doc-04"],
      ["Show the network diagram with a gateway", "technical-diagram", "Caption network topology; labels client gateway service.", "doc-05"],
      ["Which form includes retention approval?", "policy-form", "OCR retention request; checkbox approved; signature present.", "doc-06"]
    ]
  },
  {
    id: "audio-event-triage",
    slug: "audio-event-triage",
    title: "Audio Event Triage Baseline",
    domain: "audio-ml",
    mode: "classifier",
    taskCategory: "audio-classification",
    description:
      "A lightweight audio-event classifier built around auditable extracted features and confidence-based review.",
    problem:
      "Operations teams need an explainable starting point for classifying alarms, machinery noise, and speech-like events.",
    labels: ["alarm", "machinery", "speech"],
    components: [
      "Audio feature schema",
      "Feature normalization",
      "Prototype classifier",
      "Low-confidence review path",
      "Class-level evaluation"
    ],
    metrics: ["classification_accuracy", "macro_recall", "review_coverage"],
    risks:
      "The included records are synthetic feature vectors and do not replace evaluation on licensed real audio.",
    examples: [
      ["high energy repeating tone peak frequency 2100", "alarm", "Synthetic alarm feature summary.", "audio-01"],
      ["low frequency continuous vibration high zero crossing stability", "machinery", "Synthetic rotating equipment feature summary.", "audio-02"],
      ["variable pitch moderate energy speech cadence", "speech", "Synthetic spoken segment feature summary.", "audio-03"],
      ["repeating pulse bright spectrum urgent tone", "alarm", "Synthetic alert feature summary.", "audio-04"],
      ["steady hum harmonic vibration low pitch", "machinery", "Synthetic motor feature summary.", "audio-05"],
      ["syllabic rhythm changing pitch voice activity", "speech", "Synthetic voice feature summary.", "audio-06"]
    ]
  },
  {
    id: "contextual-bandit",
    slug: "contextual-bandit-simulator",
    title: "Contextual Bandit Decision Simulator",
    domain: "reinforcement-learning",
    mode: "agent",
    taskCategory: "reinforcement-learning",
    description:
      "A safe offline contextual-bandit simulator for comparing exploration policies before production experimentation.",
    problem:
      "Teams need to validate decision policies offline before exposing users or systems to online reinforcement learning.",
    labels: ["recommend-docs", "recommend-tutorial", "request-human-help"],
    components: [
      "Context and action schema",
      "Offline reward simulator",
      "Epsilon-greedy baseline",
      "Policy regret report",
      "Safety action constraints"
    ],
    metrics: ["average_reward", "policy_regret", "unsafe_action_block_rate"],
    risks:
      "Offline simulated rewards cannot prove online safety or business impact. Real experiments require review and guardrails.",
    examples: [
      ["experienced user asks for API parameter details", "recommend-docs", "Documentation is the highest-value action.", "bandit-01"],
      ["new developer asks how to build a first integration", "recommend-tutorial", "A guided tutorial is the highest-value action.", "bandit-02"],
      ["user reports a possible security compromise", "request-human-help", "Sensitive security issues require human support.", "bandit-03"],
      ["developer needs exact error code reference", "recommend-docs", "Reference material is appropriate for precise lookup.", "bandit-04"],
      ["beginner requests a complete walkthrough", "recommend-tutorial", "Structured onboarding is appropriate.", "bandit-05"],
      ["customer indicates potential data loss", "request-human-help", "High-impact cases must be escalated.", "bandit-06"]
    ]
  }
];

const tokenize = (value) =>
  String(value)
    .toLowerCase()
    .match(/[a-z0-9]+/g) || [];

const buildRecords = (blueprint) => {
  const modifiers = [
    ["direct", ""],
    ["operations", "In an operations review, "],
    ["evaluation", "For an evaluation case, "]
  ];

  return blueprint.examples.flatMap(
    ([input, label, context, source], exampleIndex) =>
      modifiers.map(([variant, prefix], variantIndex) => ({
        id: `${blueprint.id}-${exampleIndex + 1}-${variantIndex + 1}`,
        input: `${prefix}${input}`,
        label,
        context,
        source,
        variant,
        synthetic: true
      }))
  );
};

const splitRecords = (records) => ({
  train: records.filter((_, index) => index % 4 !== 3),
  test: records.filter((_, index) => index % 4 === 3)
});

const trainPrototypeModel = (blueprint, trainRecords) => {
  const prototypes = {};
  const documents = [];

  for (const record of trainRecords) {
    prototypes[record.label] ||= {};
    for (const token of tokenize(`${record.input} ${record.context}`)) {
      prototypes[record.label][token] =
        (prototypes[record.label][token] || 0) + 1;
    }
    documents.push({
      id: record.source,
      label: record.label,
      text: record.context,
      metadata: { synthetic: true, domain: blueprint.domain }
    });
  }

  const documentFrequency = {};
  for (const document of documents) {
    for (const token of new Set(tokenize(document.text))) {
      documentFrequency[token] = (documentFrequency[token] || 0) + 1;
    }
  }

  const idf = Object.fromEntries(
    Object.entries(documentFrequency).map(([token, frequency]) => [
      token,
      Number(
        (Math.log((documents.length + 1) / (frequency + 1)) + 1).toFixed(6)
      )
    ])
  );

  return {
    format: "daily-project-prototype-v1",
    project: blueprint.id,
    title: blueprint.title,
    domain: blueprint.domain,
    mode: blueprint.mode,
    labels: blueprint.labels,
    prototypes,
    idf,
    documents,
    graph_edges: blueprint.graphEdges || [],
    confidence_threshold: 0.18,
    trained_on_synthetic_data: true
  };
};

const predict = (model, input) => {
  const tokens = tokenize(input);
  const scores = Object.fromEntries(
    Object.entries(model.prototypes).map(([label, weights]) => [
      label,
      tokens.reduce((sum, token) => sum + (weights[token] || 0), 0)
    ])
  );
  return Object.entries(scores).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  )[0]?.[0];
};

const evaluateModel = (model, testRecords) => {
  const correct = testRecords.filter(
    (record) => predict(model, `${record.input} ${record.context}`) === record.label
  ).length;
  return {
    test_examples: testRecords.length,
    accuracy: Number((correct / Math.max(testRecords.length, 1)).toFixed(4)),
    synthetic_evaluation: true
  };
};

const pythonPackage = (blueprint) => slugify(blueprint.id).replaceAll("-", "_");

const pyproject = (projectName, packageName, description) => `[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "${projectName}"
version = "0.1.0"
description = "${description}"
readme = "README.md"
requires-python = ">=3.10"
license = { text = "MIT" }
authors = [{ name = "R-behera" }]
dependencies = []

[project.scripts]
${projectName} = "${packageName}.cli:main"

[tool.setuptools]
package-dir = {"" = "src"}

[tool.setuptools.packages.find]
where = ["src"]
`;

const pipelineSource = () => `"""Transparent baseline pipeline for the generated AI project."""

from __future__ import annotations

import json
import math
import re
from pathlib import Path


def tokenize(value: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", value.lower())


class Pipeline:
    def __init__(self, model: dict):
        self.model = model

    @classmethod
    def from_file(cls, path: str | Path) -> "Pipeline":
        return cls(json.loads(Path(path).read_text(encoding="utf-8")))

    def classify(self, text: str) -> tuple[str, float]:
        tokens = tokenize(text)
        scores = {
            label: sum(weights.get(token, 0) for token in tokens)
            for label, weights in self.model["prototypes"].items()
        }
        ranked = sorted(scores.items(), key=lambda item: (-item[1], item[0]))
        label, best = ranked[0]
        total = sum(max(score, 0) for _, score in ranked) or 1
        return label, best / total

    def search(self, query: str, limit: int = 3) -> list[dict]:
        query_tokens = set(tokenize(query))
        ranked = []
        for document in self.model["documents"]:
            document_tokens = set(tokenize(document["text"]))
            lexical = sum(
                self.model["idf"].get(token, 1.0)
                for token in query_tokens & document_tokens
            )
            ranked.append({**document, "score": round(lexical, 6)})
        return sorted(ranked, key=lambda item: (-item["score"], item["id"]))[:limit]

    def graph_evidence(self, text: str) -> list[dict]:
        tokens = set(tokenize(text))
        matches = []
        for subject, relation, target in self.model.get("graph_edges", []):
            edge_tokens = set(tokenize(f"{subject} {relation} {target}"))
            overlap = len(tokens & edge_tokens)
            if overlap:
                matches.append(
                    {
                        "subject": subject,
                        "relation": relation,
                        "target": target,
                        "overlap": overlap,
                    }
                )
        return sorted(matches, key=lambda item: -item["overlap"])

    def run(self, text: str) -> dict:
        label, confidence = self.classify(text)
        evidence = self.search(text)
        result = {
            "prediction": label,
            "confidence": round(confidence, 4),
            "requires_review": confidence < self.model["confidence_threshold"],
            "evidence": evidence,
        }
        if self.model["mode"] == "graph":
            result["graph_evidence"] = self.graph_evidence(text)
        if self.model["mode"] == "agent":
            result["proposed_tool"] = label
            result["approval_required"] = label in {
                "request-approval",
                "request-human-help",
            }
        return result
`;

const trainerSource = () => `"""Rebuild the transparent prototype model from JSONL training data."""

from __future__ import annotations

import argparse
import json
import math
import re
from collections import Counter, defaultdict
from pathlib import Path


def tokenize(value: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", value.lower())


def read_jsonl(path: Path) -> list[dict]:
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def train(records: list[dict], base_model: dict) -> dict:
    prototypes: dict[str, Counter] = defaultdict(Counter)
    documents = []
    for record in records:
        prototypes[record["label"]].update(
            tokenize(f'{record["input"]} {record["context"]}')
        )
        documents.append(
            {
                "id": record["source"],
                "label": record["label"],
                "text": record["context"],
                "metadata": {
                    "synthetic": True,
                    "domain": base_model["domain"],
                },
            }
        )

    document_frequency = Counter()
    for document in documents:
        document_frequency.update(set(tokenize(document["text"])))
    idf = {
        token: round(math.log((len(documents) + 1) / (frequency + 1)) + 1, 6)
        for token, frequency in document_frequency.items()
    }

    return {
        **base_model,
        "prototypes": {
            label: dict(weights) for label, weights in prototypes.items()
        },
        "documents": documents,
        "idf": idf,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", default="data/train.jsonl")
    parser.add_argument("--base-model", default="artifacts/model.json")
    parser.add_argument("--output", default="artifacts/model.json")
    args = parser.parse_args()

    base_model = json.loads(Path(args.base_model).read_text(encoding="utf-8"))
    model = train(read_jsonl(Path(args.train)), base_model)
    Path(args.output).write_text(
        json.dumps(model, indent=2) + "\\n",
        encoding="utf-8",
    )
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
`;

const evaluatorSource = (packageName) => `"""Evaluate the generated baseline on the held-out synthetic split."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from ${packageName}.pipeline import Pipeline


def read_jsonl(path: Path) -> list[dict]:
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="artifacts/model.json")
    parser.add_argument("--test", default="data/test.jsonl")
    args = parser.parse_args()

    pipeline = Pipeline.from_file(args.model)
    records = read_jsonl(Path(args.test))
    correct = sum(
        pipeline.run(f'{record["input"]} {record["context"]}')["prediction"]
        == record["label"]
        for record in records
    )
    accuracy = correct / max(len(records), 1)
    report = {
        "examples": len(records),
        "accuracy": round(accuracy, 4),
        "synthetic_evaluation": True,
    }
    print(json.dumps(report, indent=2))
    raise SystemExit(0 if accuracy >= 0.5 else 1)


if __name__ == "__main__":
    main()
`;

const cliSource = (packageName) => `"""Command-line interface."""

from __future__ import annotations

import argparse
import json

from ${packageName}.pipeline import Pipeline


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("text")
    parser.add_argument("--model", default="artifacts/model.json")
    args = parser.parse_args()

    result = Pipeline.from_file(args.model).run(args.text)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
`;

const testSource = (packageName, blueprint, model) => `import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from ${packageName}.pipeline import Pipeline


class PipelineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pipeline = Pipeline.from_file(ROOT / "artifacts" / "model.json")

    def test_model_metadata(self):
        self.assertEqual(self.pipeline.model["project"], "${blueprint.id}")
        self.assertTrue(self.pipeline.model["trained_on_synthetic_data"])

    def test_prediction_and_evidence(self):
        result = self.pipeline.run(${JSON.stringify(blueprint.examples[0][0])})
        self.assertIn(result["prediction"], ${JSON.stringify(model.labels)})
        self.assertGreaterEqual(len(result["evidence"]), 1)
        self.assertIn("requires_review", result)


if __name__ == "__main__":
    unittest.main()
`;

const architectureDocument = (blueprint) => `# Architecture

## Problem

${blueprint.problem}

## System Flow

\`\`\`mermaid
flowchart LR
    A["Input event or query"] --> B["Validation and normalization"]
    B --> C["${blueprint.components[0]}"]
    C --> D["${blueprint.components[1]}"]
    D --> E["${blueprint.components[2]}"]
    E --> F["${blueprint.components[3]}"]
    F --> G["${blueprint.components[4]}"]
    G --> H["Prediction, evidence, and review signal"]
\`\`\`

## Components

${blueprint.components.map((component) => `- **${component}**`).join("\n")}

## Model Architecture

The included baseline is a transparent token-prototype model. Training builds
per-label token weights and inverse-document-frequency retrieval weights from
the synthetic training split. The runtime returns a prediction, confidence,
review flag, and evidence documents. This baseline is intentionally small so
it can run in CI without paid compute.

For production, compare it with domain embeddings, gradient-boosted models, or
fine-tuned transformer models using the same held-out evaluation contract.

## Production Boundaries

- Validate and version all input schemas.
- Keep human review for low-confidence or high-impact decisions.
- Store prompts, traces, model versions, and dataset versions together.
- Do not treat synthetic evaluation performance as production evidence.
- Add authentication, authorization, encryption, and retention controls.

## Known Risks

${blueprint.risks}
`;

const modelCard = (blueprint, projectName, model, metrics) => `---
license: mit
library_name: custom
pipeline_tag: ${blueprint.taskCategory}
datasets:
- {{HF_NAMESPACE}}/${projectName}-dataset
tags:
- synthetic-data
- transparent-baseline
- ${blueprint.domain}
metrics:
- accuracy
---

# ${blueprint.title} Baseline Model

## Model Description

This repository contains a small, transparent prototype model for
**${blueprint.problem}**

The model combines per-label token weights with IDF-weighted evidence
retrieval. It was generated for reproducible architecture demonstrations and
does not call a hosted LLM.

## Evaluation

- Held-out synthetic examples: ${metrics.test_examples}
- Accuracy: ${metrics.accuracy}
- Intended metrics: ${blueprint.metrics.join(", ")}

## Intended Use

- Architecture prototyping
- CI and evaluation examples
- Local baseline comparisons
- Educational experimentation

## Limitations and Risks

${blueprint.risks}

The dataset is synthetic and small. Do not use this model for consequential
decisions without representative data, expert review, and production-grade
evaluation.

## Reproducibility

The linked GitHub repository includes \`train.py\`, the exact dataset split,
evaluation code, and the model JSON format.
`;

const datasetCard = (blueprint, projectName, train, test) => `---
license: cc-by-4.0
language:
- en
pretty_name: ${blueprint.title} Synthetic Evaluation Set
size_categories:
- n<1K
task_categories:
- ${blueprint.taskCategory}
tags:
- synthetic
- ${blueprint.domain}
- evaluation
configs:
- config_name: default
  data_files:
  - split: train
    path: data/train.jsonl
  - split: test
    path: data/test.jsonl
---

# ${blueprint.title} Synthetic Dataset

## Summary

This dataset contains ${train.length} training examples and ${test.length}
held-out examples for **${blueprint.problem}**

Every record is synthetic and includes:

- \`input\`: query, event, or feature description
- \`label\`: expected class, route, relation, or evidence category
- \`context\`: synthetic supporting context
- \`source\`: fictional source identifier
- \`variant\`: generation pattern
- \`synthetic\`: always \`true\`

## Uses

- Reproducible unit and integration tests
- Baseline model training
- Evaluation harness development
- Schema and architecture demonstrations

## Limitations

${blueprint.risks}

This dataset does not represent real users, patients, customers, production
traffic, or licensed media. It must not be presented as real-world evidence.

## Related Model

[{{HF_NAMESPACE}}/${projectName}-model](https://huggingface.co/{{HF_NAMESPACE}}/${projectName}-model)
`;

const readme = (blueprint, projectName, packageName, date, metrics) => `# ${blueprint.title}

${blueprint.description}

Generated on ${date} as an independent production-AI architecture project.

## Why It Matters

${blueprint.problem}

## Included

- Runnable Python pipeline with no runtime dependencies
- Reproducible training script
- Held-out evaluation command
- Synthetic dataset with explicit provenance
- Trained transparent baseline model
- Architecture and production-boundary documentation
- Unit tests, CI workflow, and Dockerfile
- Hugging Face-ready model and dataset cards

## Architecture

${blueprint.components.map((component) => `1. ${component}`).join("\n")}

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full flow and production
boundaries.

## Quick Start

\`\`\`bash
python3 -m unittest discover -s tests
PYTHONPATH=src python3 -m ${packageName}.cli ${JSON.stringify(blueprint.examples[0][0])}
PYTHONPATH=src python3 evaluate.py
\`\`\`

Rebuild the model:

\`\`\`bash
python3 train.py
\`\`\`

## Baseline Evaluation

- Held-out synthetic examples: ${metrics.test_examples}
- Accuracy: ${metrics.accuracy}
- Target metrics: ${blueprint.metrics.join(", ")}

This score verifies that the code and evaluation contract work. It does not
claim production performance.

## Hugging Face Artifacts

When the controller has a Hugging Face token and namespace configured, it
publishes:

- Dataset: \`${projectName}-dataset\`
- Model: \`${projectName}-model\`

## Safety

${blueprint.risks}

Review [SECURITY.md](SECURITY.md), [MODEL_CARD.md](MODEL_CARD.md), and
[DATASET_CARD.md](DATASET_CARD.md) before adapting this project.
`;

const dockerfile = (packageName, example) => `FROM python:3.12-slim

WORKDIR /app
COPY . .

ENV PYTHONPATH=/app/src
CMD ["python", "-m", "${packageName}.cli", ${JSON.stringify(example)}]
`;

const ciWorkflow = `name: CI

on:
  push:
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-python@v6
        with:
          python-version: "3.12"
      - run: python -m unittest discover -s tests
      - run: PYTHONPATH=src python evaluate.py
`;

const securityDocument = (blueprint) => `# Security and Responsible Use

## Data

The bundled dataset is synthetic. Do not replace it with sensitive production
data without an approved data-governance process.

## Model

The baseline is deterministic and inspectable, but this does not make it safe
for consequential use. Validate accuracy, bias, privacy, failure handling, and
human escalation in the target environment.

## Domain Warning

${blueprint.risks}

## Reporting

Do not include credentials, personal data, protected health information, or
proprietary documents in public issues.
`;

const jsonl = (records) =>
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;

export function industryProject({ profile, date, suffix }) {
  const dayNumber = Math.floor(
    Date.parse(`${date}T00:00:00Z`) / 86_400_000
  );
  const blueprint = industryBlueprints[dayNumber % industryBlueprints.length];
  const projectName = `${blueprint.slug}-${suffix}`;
  const packageName = pythonPackage(blueprint);
  const records = buildRecords(blueprint);
  const { train, test } = splitRecords(records);
  const model = trainPrototypeModel(blueprint, train);
  const metrics = evaluateModel(model, test);
  const datasetReadme = datasetCard(blueprint, projectName, train, test);
  const modelReadme = modelCard(blueprint, projectName, model, metrics);
  const modelJson = json(model);

  const files = {
    "pyproject.toml": pyproject(
      projectName,
      packageName,
      blueprint.description
    ),
    [`src/${packageName}/__init__.py`]: `"""${blueprint.title}."""\n`,
    [`src/${packageName}/pipeline.py`]: pipelineSource(),
    [`src/${packageName}/cli.py`]: cliSource(packageName),
    "train.py": trainerSource(),
    "evaluate.py": evaluatorSource(packageName),
    "tests/test_pipeline.py": testSource(packageName, blueprint, model),
    "data/train.jsonl": jsonl(train),
    "data/test.jsonl": jsonl(test),
    "artifacts/model.json": modelJson,
    "README.md": readme(
      blueprint,
      projectName,
      packageName,
      date,
      metrics
    ),
    "ARCHITECTURE.md": architectureDocument(blueprint),
    "MODEL_CARD.md": modelReadme,
    "DATASET_CARD.md": datasetReadme,
    "SECURITY.md": securityDocument(blueprint),
    "Dockerfile": dockerfile(packageName, blueprint.examples[0][0]),
    ".dockerignore": "__pycache__/\n*.pyc\n.git/\n",
    ".gitignore": "__pycache__/\n*.pyc\n.venv/\n.env\n",
    ".github/workflows/ci.yml": ciWorkflow,
    "LICENSE": license(profile.login, date.slice(0, 4))
  };

  return {
    name: projectName,
    description: blueprint.description,
    blueprint: blueprint.id,
    architecture: blueprint.mode,
    topics: [
      "artificial-intelligence",
      blueprint.domain,
      blueprint.mode,
      "machine-learning",
      "production-ai"
    ],
    files,
    huggingFace: {
      dataset: {
        name: `${projectName}-dataset`,
        files: {
          "README.md": datasetReadme,
          "data/train.jsonl": jsonl(train),
          "data/test.jsonl": jsonl(test)
        }
      },
      model: {
        name: `${projectName}-model`,
        files: {
          "README.md": modelReadme,
          "model.json": modelJson,
          "inference.py": pipelineSource(),
          "evaluation.json": json(metrics)
        }
      }
    }
  };
}
