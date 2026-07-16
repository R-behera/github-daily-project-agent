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

const projectProfiles = {
  "clinical-rag-safety": {
    huggingFaceTasks: [
      "question-answering",
      "sentence-similarity",
      "text-classification",
      "summarization"
    ],
    stack: [
      "FastAPI for typed service endpoints",
      "LangGraph for durable safety and escalation workflows",
      "LlamaIndex for ingestion and retrieval abstractions",
      "PostgreSQL plus pgvector for filtered vector search",
      "Redis for caching and rate limiting",
      "OpenTelemetry plus Phoenix for traces and evaluation"
    ],
    dataSources: [
      {
        name: "ClinicalTrials.gov API v2",
        url: "https://clinicaltrials.gov/api/v2/studies?pageSize=5",
        purpose: "Public study metadata for retrieval and citation tests"
      },
      {
        name: "openFDA drug labels",
        url: "https://api.fda.gov/drug/label.json?limit=5",
        purpose: "Public drug-label text for safety-oriented ingestion"
      }
    ],
    jobSkills: [
      "Production RAG design and retrieval evaluation",
      "Healthcare AI safety, abstention, and auditability",
      "Vector databases and metadata-aware retrieval",
      "Agent orchestration with human review",
      "LLMOps tracing, regression tests, and release gates"
    ],
    impactTargets: [
      "Reach Recall@5 >= 0.85 on a reviewed retrieval set",
      "Maintain 100% citation coverage for non-abstained answers",
      "Block 100% of diagnosis or emergency-advice test prompts",
      "Keep p95 retrieval latency below 300 ms at 50 requests/second"
    ]
  },
  "agentic-incident-response": {
    huggingFaceTasks: [
      "text-classification",
      "text-generation",
      "summarization",
      "question-answering"
    ],
    stack: [
      "FastAPI for incident and approval APIs",
      "LangGraph for durable multi-agent orchestration",
      "PostgreSQL for checkpoints and audit events",
      "Redis for queues, locks, and idempotency",
      "OpenTelemetry plus Prometheus and Grafana",
      "Docker Compose for reproducible service integration"
    ],
    dataSources: [
      {
        name: "GitHub Events API",
        url: "https://api.github.com/events?per_page=10",
        purpose: "Real deployment and repository activity events"
      },
      {
        name: "Hacker News API",
        url: "https://hacker-news.firebaseio.com/v0/topstories.json",
        purpose: "Public event-stream input for routing and summarization"
      }
    ],
    jobSkills: [
      "Multi-agent planning and tool orchestration",
      "Human-in-the-loop approval and durable execution",
      "Idempotent integrations and failure recovery",
      "Telemetry-driven agent evaluation",
      "Least-privilege production automation"
    ],
    impactTargets: [
      "Route >= 90% of reviewed incidents to the correct first tool",
      "Block 100% of state-changing actions without approval",
      "Resume interrupted plans without duplicate tool execution",
      "Reduce simulated time-to-triage by >= 40% versus manual routing"
    ]
  },
  "hybrid-semantic-search": {
    huggingFaceTasks: [
      "sentence-similarity",
      "feature-extraction",
      "text-ranking",
      "question-answering"
    ],
    stack: [
      "FastAPI for search and indexing APIs",
      "Sentence Transformers for dense embeddings",
      "PostgreSQL plus pgvector HNSW indexes",
      "BM25-compatible lexical retrieval",
      "Redis for query and embedding caches",
      "OpenTelemetry for latency and recall diagnostics"
    ],
    dataSources: [
      {
        name: "arXiv API",
        url: "https://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=5",
        purpose: "Real technical papers for hybrid indexing"
      },
      {
        name: "Stack Exchange API",
        url: "https://api.stackexchange.com/2.3/questions?pagesize=5&order=desc&sort=activity&tagged=machine-learning&site=stackoverflow",
        purpose: "Real technical questions and metadata filters"
      }
    ],
    jobSkills: [
      "Dense, sparse, and hybrid information retrieval",
      "Embedding model evaluation and vector-index tuning",
      "Metadata authorization and filtered ANN search",
      "Search relevance metrics and offline judgments",
      "Latency, cost, and recall trade-off analysis"
    ],
    impactTargets: [
      "Reach Recall@10 >= 0.90 on a labeled relevance set",
      "Improve MRR by >= 15% over lexical-only retrieval",
      "Keep p95 search latency below 250 ms at one million vectors",
      "Demonstrate authorization filters with zero cross-tenant leakage"
    ]
  },
  "knowledge-graph-risk": {
    huggingFaceTasks: [
      "token-classification",
      "feature-extraction",
      "question-answering",
      "sentence-similarity"
    ],
    stack: [
      "FastAPI for entity and evidence APIs",
      "Neo4j Community or PostgreSQL recursive queries",
      "Sentence Transformers for entity resolution",
      "NetworkX for local graph validation",
      "Kafka-compatible event ingestion",
      "OpenTelemetry for lineage and query traces"
    ],
    dataSources: [
      {
        name: "SEC EDGAR submissions API",
        url: "https://data.sec.gov/submissions/CIK0000320193.json",
        purpose: "Public company and filing relationships"
      },
      {
        name: "GLEIF LEI API",
        url: "https://api.gleif.org/api/v1/lei-records?page[size]=5",
        purpose: "Public legal-entity identifiers and relationships"
      }
    ],
    jobSkills: [
      "Entity resolution and relation extraction",
      "Knowledge-graph modeling and path queries",
      "Graph-based explainability and provenance",
      "Streaming ingestion and schema evolution",
      "Risk-model evaluation and data quality controls"
    ],
    impactTargets: [
      "Reach entity-resolution precision >= 0.95 on reviewed pairs",
      "Return evidence paths for 100% of emitted risk flags",
      "Process 10,000 relationship events per minute in load tests",
      "Detect schema and orphan-node regressions in CI"
    ]
  },
  "rag-evaluation": {
    huggingFaceTasks: [
      "text-classification",
      "question-answering",
      "text-ranking",
      "summarization"
    ],
    stack: [
      "FastAPI for evaluation jobs and reports",
      "Ragas-style retrieval and faithfulness metrics",
      "MLflow for experiment and artifact tracking",
      "PostgreSQL for versioned evaluation cases",
      "OpenTelemetry plus Phoenix for trace inspection",
      "GitHub Actions for threshold-based release gates"
    ],
    dataSources: [
      {
        name: "GitHub REST API",
        url: "https://api.github.com/repos/huggingface/transformers/issues?state=open&per_page=5",
        purpose: "Real technical questions for evaluation-set construction"
      },
      {
        name: "arXiv API",
        url: "https://export.arxiv.org/api/query?search_query=all:retrieval%20augmented%20generation&start=0&max_results=5",
        purpose: "Public RAG literature for grounded-answer cases"
      }
    ],
    jobSkills: [
      "LLM and RAG evaluation design",
      "Golden datasets and failure taxonomies",
      "Experiment tracking and model release gates",
      "Trace-level diagnosis and prompt regression testing",
      "Statistical comparison of AI system versions"
    ],
    impactTargets: [
      "Detect 100% of seeded unsupported-answer regressions",
      "Track retrieval, faithfulness, citation, latency, and cost metrics",
      "Fail CI when any critical metric drops beyond tolerance",
      "Produce comparable evaluation reports for every model version"
    ]
  },
  "ai-observability": {
    huggingFaceTasks: [
      "text-classification",
      "token-classification",
      "summarization",
      "zero-shot-classification"
    ],
    stack: [
      "OpenTelemetry GenAI semantic conventions",
      "OpenTelemetry Collector for vendor-neutral ingestion",
      "ClickHouse or PostgreSQL for trace analytics",
      "Prometheus and Grafana for service-level metrics",
      "MLflow for model and prompt version linkage",
      "FastAPI for trace search and regression APIs"
    ],
    dataSources: [
      {
        name: "Prometheus HTTP API",
        url: "https://prometheus.demo.do.prometheus.io/api/v1/query?query=up",
        purpose: "Real time-series telemetry for anomaly pipelines"
      },
      {
        name: "GitHub Events API",
        url: "https://api.github.com/events?per_page=10",
        purpose: "Deployment-correlated public event metadata"
      }
    ],
    jobSkills: [
      "LLMOps observability and trace instrumentation",
      "Prompt, model, dataset, and deployment lineage",
      "SLOs, anomaly detection, and incident diagnostics",
      "High-volume telemetry storage and aggregation",
      "Evaluation-driven production monitoring"
    ],
    impactTargets: [
      "Ingest 1,000 synthetic traces/second without loss",
      "Detect seeded latency and quality regressions with >= 0.90 precision",
      "Link 100% of traces to model, prompt, and dataset versions",
      "Generate a release health report in under 60 seconds"
    ]
  },
  "support-routing-ml": {
    huggingFaceTasks: [
      "text-classification",
      "zero-shot-classification",
      "sentence-similarity",
      "summarization"
    ],
    stack: [
      "FastAPI for prediction and feedback endpoints",
      "scikit-learn or LightGBM for production baselines",
      "Sentence Transformers for semantic fallback",
      "MLflow for experiments and model registry",
      "PostgreSQL for labels and human feedback",
      "Evidently-style drift and quality monitoring"
    ],
    dataSources: [
      {
        name: "GitHub Issues API",
        url: "https://api.github.com/repos/pytorch/pytorch/issues?state=open&per_page=10",
        purpose: "Real technical support-style issue text"
      },
      {
        name: "Stack Exchange API",
        url: "https://api.stackexchange.com/2.3/questions?pagesize=10&order=desc&sort=activity&site=stackoverflow",
        purpose: "Real developer questions for weak-label experiments"
      }
    ],
    jobSkills: [
      "Applied NLP classification and confidence calibration",
      "Human feedback loops and active learning",
      "Model registry, drift monitoring, and retraining",
      "Feature, label, and evaluation pipeline design",
      "Business-aware automation and escalation metrics"
    ],
    impactTargets: [
      "Reach macro F1 >= 0.85 on a reviewed support set",
      "Automate >= 60% of tickets at >= 0.90 precision",
      "Route low-confidence cases to human review",
      "Detect label and feature drift before SLA impact"
    ]
  },
  "multimodal-document-retrieval": {
    huggingFaceTasks: [
      "visual-document-retrieval",
      "document-question-answering",
      "image-to-text",
      "feature-extraction"
    ],
    stack: [
      "FastAPI for ingestion and multimodal search",
      "Transformers with LayoutLMv3 or ColPali-style encoders",
      "OCR adapter plus image captioning",
      "PostgreSQL plus pgvector for fused embeddings",
      "Object storage for source documents",
      "OpenTelemetry plus retrieval ablation reports"
    ],
    dataSources: [
      {
        name: "SEC EDGAR company facts API",
        url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json",
        purpose: "Real tabular filing facts and document metadata"
      },
      {
        name: "arXiv API",
        url: "https://export.arxiv.org/api/query?search_query=all:document%20understanding&start=0&max_results=5",
        purpose: "Public papers and document-layout retrieval scenarios"
      }
    ],
    jobSkills: [
      "Multimodal embeddings and document understanding",
      "OCR, layout, image, and text feature fusion",
      "Vector retrieval and modality-aware ranking",
      "Ablation testing and retrieval evaluation",
      "Scalable document ingestion and object storage"
    ],
    impactTargets: [
      "Improve Recall@5 by >= 20% over text-only retrieval",
      "Report modality ablations for OCR, layout, and image signals",
      "Index 100,000 documents with resumable ingestion",
      "Keep p95 retrieval latency below 500 ms"
    ]
  },
  "audio-event-triage": {
    huggingFaceTasks: [
      "audio-classification",
      "automatic-speech-recognition",
      "feature-extraction",
      "audio-to-audio"
    ],
    stack: [
      "FastAPI for audio metadata and prediction APIs",
      "Transformers with Wav2Vec2 or audio spectrogram models",
      "librosa or torchaudio for feature extraction",
      "MLflow for experiment and model registry",
      "Object storage for licensed audio",
      "OpenTelemetry for inference latency and error traces"
    ],
    dataSources: [
      {
        name: "Freesound API",
        url: "https://freesound.org/apiv2/search/text/?query=alarm&page_size=5",
        purpose: "Licensed public audio search when an API key is configured"
      },
      {
        name: "Hugging Face Datasets API",
        url: "https://huggingface.co/api/datasets?search=audio-classification&limit=5",
        purpose: "Discover public audio datasets and metadata"
      }
    ],
    jobSkills: [
      "Audio feature pipelines and model fine-tuning",
      "Class imbalance and macro-metric evaluation",
      "Streaming inference and confidence calibration",
      "Dataset licensing and provenance controls",
      "Model monitoring and human review workflows"
    ],
    impactTargets: [
      "Reach macro recall >= 0.85 on a licensed evaluation set",
      "Review every prediction below the confidence threshold",
      "Process one minute of audio in under five seconds",
      "Track class-level drift and false-negative rates"
    ]
  },
  "contextual-bandit": {
    huggingFaceTasks: [
      "reinforcement-learning",
      "text-classification",
      "feature-extraction",
      "sentence-similarity"
    ],
    stack: [
      "FastAPI for policy and feedback endpoints",
      "Vowpal Wabbit or River for online-learning baselines",
      "PostgreSQL for contexts, actions, propensities, and rewards",
      "Redis for low-latency policy serving",
      "MLflow for policy versioning",
      "OpenTelemetry for decisions and delayed rewards"
    ],
    dataSources: [
      {
        name: "Hacker News API",
        url: "https://hacker-news.firebaseio.com/v0/topstories.json",
        purpose: "Real content candidates for recommendation simulations"
      },
      {
        name: "Open-Meteo API",
        url: "https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current=temperature_2m",
        purpose: "Real contextual features without authentication"
      }
    ],
    jobSkills: [
      "Contextual bandits and offline policy evaluation",
      "Propensity logging and counterfactual metrics",
      "Low-latency decision services",
      "Safe exploration and constrained actions",
      "Delayed-feedback pipelines and policy monitoring"
    ],
    impactTargets: [
      "Beat a random policy by >= 20% average simulated reward",
      "Report IPS and doubly robust offline estimates",
      "Block 100% of disallowed actions before serving",
      "Serve policy decisions below 50 ms p95"
    ]
  }
};

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
  const documentsById = new Map();

  for (const record of trainRecords) {
    prototypes[record.label] ||= {};
    for (const token of tokenize(`${record.input} ${record.context}`)) {
      prototypes[record.label][token] =
        (prototypes[record.label][token] || 0) + 1;
    }
    documentsById.set(record.source, {
      id: record.source,
      label: record.label,
      text: record.context,
      metadata: { synthetic: true, domain: blueprint.domain }
    });
  }

  const documents = [...documentsById.values()];
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
    documents_by_id = {}
    for record in records:
        prototypes[record["label"]].update(
            tokenize(f'{record["input"]} {record["context"]}')
        )
        documents_by_id[record["source"]] = {
            "id": record["source"],
            "label": record["label"],
            "text": record["context"],
            "metadata": {
                "synthetic": True,
                "domain": base_model["domain"],
            },
        }

    documents = list(documents_by_id.values())
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

const serviceSource = (packageName) => `"""Dependency-free JSON HTTP service for local and container demos."""

from __future__ import annotations

import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from ${packageName}.pipeline import Pipeline


PIPELINE = Pipeline.from_file(
    os.environ.get("MODEL_PATH", "artifacts/model.json")
)


class Handler(BaseHTTPRequestHandler):
    def respond(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/health":
            self.respond(200, {"status": "ok", "project": PIPELINE.model["project"]})
            return
        self.respond(404, {"error": "not_found"})

    def do_POST(self) -> None:
        if self.path != "/predict":
            self.respond(404, {"error": "not_found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length))
            text = str(payload["text"]).strip()
            if not text:
                raise ValueError("text is required")
            self.respond(200, PIPELINE.run(text))
        except (ValueError, KeyError, json.JSONDecodeError) as error:
            self.respond(400, {"error": str(error)})

    def log_message(self, message: str, *args: object) -> None:
        print(
            json.dumps(
                {
                    "event": "http_request",
                    "client": self.client_address[0],
                    "message": message % args,
                }
            )
        )


def main() -> None:
    port = int(os.environ.get("PORT", "8080"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(json.dumps({"event": "service_started", "port": port}))
    server.serve_forever()


if __name__ == "__main__":
    main()
`;

const realWorldConnectorSource = (projectProfile) => `"""Public-data connectors for the portfolio expansion phase.

The generated test suite never calls the network. Run this module manually to
download a small raw snapshot, then review licensing and terms before use.
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.request
from pathlib import Path


SOURCES = ${JSON.stringify(projectProfile.dataSources, null, 4)}


def fetch(source: dict) -> bytes:
    request = urllib.request.Request(
        source["url"],
        headers={
            "Accept": "application/json, application/xml, text/plain",
            "User-Agent": os.environ.get(
                "DATA_SOURCE_USER_AGENT",
                "industry-ai-portfolio/0.1 contact@example.com",
            ),
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=int, default=0)
    parser.add_argument("--output", default="data/raw/source-snapshot.txt")
    args = parser.parse_args()

    source = SOURCES[args.source]
    destination = Path(args.output)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(fetch(source))
    print(
        json.dumps(
            {
                "source": source["name"],
                "purpose": source["purpose"],
                "output": str(destination),
                "bytes": destination.stat().st_size,
            },
            indent=2,
        )
    )


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
        evidence_ids = [item["id"] for item in result["evidence"]]
        self.assertEqual(len(evidence_ids), len(set(evidence_ids)))
        self.assertIn("requires_review", result)


if __name__ == "__main__":
    unittest.main()
`;

const architectureDocument = (blueprint, projectProfile) => `# Architecture

## Problem

${blueprint.problem}

## System Flow

\`\`\`mermaid
flowchart LR
    A["Real-world API or event stream"] --> B["Validated ingestion"]
    B --> C["Versioned raw and curated data"]
    C --> D["${blueprint.components[0]}"]
    D --> E["${blueprint.components[1]}"]
    E --> F["${blueprint.components[2]}"]
    F --> G["${blueprint.components[3]}"]
    G --> H["${blueprint.components[4]}"]
    H --> I["Prediction, evidence, and review signal"]
    I --> J["Evaluation and release gate"]
    I --> K["OpenTelemetry traces and service metrics"]
    J --> L["Model and dataset registry"]
\`\`\`

## Components

${blueprint.components.map((component) => `- **${component}**`).join("\n")}

## Recommended Production Stack

${projectProfile.stack.map((item) => `- ${item}`).join("\n")}

## Hugging Face Tasks

${projectProfile.huggingFaceTasks.map((task) => `- \`${task}\``).join("\n")}

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

const productionDocument = (blueprint, projectProfile) => `# Production Design

This document defines how to take the dependency-free baseline toward a
portfolio-quality production implementation. The goal is to demonstrate the
engineering around an AI model, not merely wrap a hosted inference API.

## Real-World Data Sources

| Source | Purpose | Endpoint |
| --- | --- | --- |
${projectProfile.dataSources
  .map(
    (source) =>
      `| ${source.name} | ${source.purpose} | \`${source.url}\` |`
  )
  .join("\n")}

Use \`python -m ${pythonPackage(blueprint)}.real_world\` to fetch a small raw
snapshot. Review API terms, data licenses, rate limits, privacy, and retention
before building a durable ingestion job.

## Service Boundaries

- **Ingestion:** resumable API clients, raw snapshots, schema validation, and
  dead-letter handling.
- **Index/training:** versioned transformations, deterministic splits, and
  artifact lineage.
- **Online inference:** typed requests, confidence thresholds, evidence, and
  human review.
- **Evaluation:** offline golden sets, adversarial cases, release thresholds,
  and production feedback.
- **Observability:** OpenTelemetry traces, latency and cost metrics, model and
  prompt versions, and privacy-safe logs.

## Scaling Targets

${projectProfile.impactTargets.map((target) => `- ${target}`).join("\n")}

## Data and Model Versioning

Store the source snapshot ID, transformation commit, dataset version, model
version, evaluation report, and deployment SHA together. A release is eligible
only when its evaluation thresholds pass in CI.

## Reliability

- Make ingestion and tool calls idempotent.
- Retry transient failures with bounded exponential backoff.
- Persist workflow state before external side effects.
- Add circuit breakers around remote APIs and model providers.
- Preserve the last known-good index and model for rollback.

## Security

- Use least-privilege credentials and secret managers.
- Enforce authorization before retrieval or tool execution.
- Redact sensitive fields before traces and logs.
- Validate uploaded documents and isolate parsing workloads.
- Require human approval for consequential state changes.
`;

const portfolioDocument = (blueprint, projectProfile) => `# Portfolio and Career Mapping

## Project Pitch

**${blueprint.title}** solves this real-world problem:

${blueprint.problem}

It combines ${projectProfile.huggingFaceTasks
  .map((task) => `\`${task}\``)
  .join(", ")} with data ingestion, evaluation, observability, and scalable
service design.

## Why This Is More Than an API Wrapper

- Owns ingestion, validation, model artifacts, and evaluation datasets.
- Exposes evidence and confidence instead of returning opaque text.
- Includes offline evaluation and a CI release gate.
- Defines tracing, rollback, human review, and failure recovery.
- Provides a realistic path from free local baseline to production stack.

## AI Engineering Job Description Mapping

${projectProfile.jobSkills.map((skill) => `- ${skill}`).join("\n")}

## Resume-Ready Impact Targets

Replace targets with measured results after completing the roadmap:

${projectProfile.impactTargets.map((target) => `- ${target}`).join("\n")}

Example resume format:

> Built ${blueprint.title}, a production-oriented ${blueprint.domain} system
> using ${projectProfile.stack.slice(0, 3).join(", ")}; measured
> ${projectProfile.metrics?.join(", ") || blueprint.metrics.join(", ")} and
> enforced regression thresholds in CI.

## Interview Discussion Areas

- Why this architecture fits the problem and where it fails
- Retrieval/model choice and baseline comparisons
- Evaluation-set construction and metric trade-offs
- Data privacy, authorization, and human escalation
- Scaling, caching, index tuning, and failure recovery
- Model, prompt, dataset, and deployment lineage
`;

const roadmapDocument = (blueprint, projectProfile) => `# 12-Week Solo Engineering Roadmap

The generated repository is the tested foundation. The plan below is scoped for
one engineer working part time over one to three months.

## Weeks 1-2: Problem and Data Contract

- Define users, decisions, failure severity, and non-goals.
- Integrate one public source: ${projectProfile.dataSources[0].name}.
- Add raw-data snapshots, schema validation, and provenance.
- Build a 50-100 example human-reviewed evaluation set.

## Weeks 3-4: Retrieval or Model Baseline

- Reproduce the included transparent baseline.
- Add one stronger open model for ${projectProfile.huggingFaceTasks[0]}.
- Compare quality, latency, memory, and operational complexity.
- Establish versioned experiment reports.

## Weeks 5-6: Orchestration and Product API

- Implement typed FastAPI endpoints and asynchronous jobs.
- Add workflow state, retries, idempotency, and human review.
- Persist artifacts and metadata in PostgreSQL.
- Add tenant or role filters before retrieval and actions.

## Weeks 7-8: Evaluation and LLMOps

- Expand adversarial, low-confidence, and failure-mode tests.
- Add model, prompt, dataset, and deployment lineage.
- Instrument traces and metrics with OpenTelemetry.
- Block releases when critical metrics regress.

## Weeks 9-10: Scale and Reliability

- Run load tests against the targets in \`PRODUCTION.md\`.
- Tune caches, batching, indexes, and concurrency.
- Add rollback, circuit breakers, and degraded-mode behavior.
- Document cost and capacity assumptions.

## Weeks 11-12: Portfolio Release

- Deploy a public demo using only safe sample data.
- Publish architecture decisions and a short technical write-up.
- Record measured impact metrics and limitations.
- Add screenshots, sequence diagrams, and a two-minute demo video.

## Definition of Done

- CI tests, evaluation gates, and security checks pass.
- A reviewer can reproduce training and evaluation.
- Public APIs are used within their terms and rate limits.
- Production claims are backed by measured evidence.
- Model and dataset cards describe limitations honestly.
`;

const projectManifest = (blueprint, projectProfile, metrics) => ({
  name: blueprint.title,
  problem: blueprint.problem,
  domain: blueprint.domain,
  architecture: blueprint.mode,
  hugging_face_tasks: projectProfile.huggingFaceTasks,
  recommended_stack: projectProfile.stack,
  real_world_data_sources: projectProfile.dataSources,
  job_description_skills: projectProfile.jobSkills,
  impact_targets: projectProfile.impactTargets,
  baseline_evaluation: metrics,
  estimated_delivery: "8-12 weeks for one engineer",
  generated_baseline_is_production_ready: false
});

const modelCard = (
  blueprint,
  projectName,
  model,
  metrics,
  projectProfile
) => `---
license: mit
library_name: custom
pipeline_tag: ${blueprint.taskCategory}
datasets:
- {{HF_NAMESPACE}}/${projectName}-dataset
tags:
- synthetic-data
- transparent-baseline
- ${blueprint.domain}
${projectProfile.huggingFaceTasks.map((task) => `- ${task}`).join("\n")}
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

## Hugging Face Task Coverage

${projectProfile.huggingFaceTasks.map((task) => `- \`${task}\``).join("\n")}

## Limitations and Risks

${blueprint.risks}

The dataset is synthetic and small. Do not use this model for consequential
decisions without representative data, expert review, and production-grade
evaluation.

## Reproducibility

The linked GitHub repository includes \`train.py\`, the exact dataset split,
evaluation code, and the model JSON format.
`;

const datasetCard = (
  blueprint,
  projectName,
  train,
  test,
  projectProfile
) => `---
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
${projectProfile.huggingFaceTasks.map((task) => `- ${task}`).join("\n")}
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

const readme = (
  blueprint,
  projectName,
  packageName,
  date,
  metrics,
  projectProfile
) => `# ${blueprint.title}

${blueprint.description}

Generated on ${date} as an independent production-AI architecture project.

## Real-World Problem

${blueprint.problem}

## Hugging Face Tasks

${projectProfile.huggingFaceTasks.map((task) => `- \`${task}\``).join("\n")}

## Recommended Production Stack

${projectProfile.stack.map((item) => `- ${item}`).join("\n")}

## Included

- Runnable Python pipeline with no runtime dependencies
- Local JSON HTTP inference service
- Public-data API connector with explicit provenance
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
PYTHONPATH=src python3 -m ${packageName}.service
\`\`\`

The service exposes \`GET /health\` and \`POST /predict\`.

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

## Portfolio Value

This repository maps to production AI engineering work in:

${projectProfile.jobSkills.map((skill) => `- ${skill}`).join("\n")}

See [PORTFOLIO.md](PORTFOLIO.md) for resume-ready impact targets and interview
discussion areas.

## 1-3 Month Expansion

Follow [ROADMAP.md](ROADMAP.md) to add real-world APIs, a stronger open model,
durable orchestration, evaluation, observability, scalability testing, and a
public deployment.

## Safety

${blueprint.risks}

Review [ARCHITECTURE.md](ARCHITECTURE.md),
[PRODUCTION.md](PRODUCTION.md), [SECURITY.md](SECURITY.md),
[MODEL_CARD.md](MODEL_CARD.md), and [DATASET_CARD.md](DATASET_CARD.md) before
adapting this project.
`;

const dockerfile = (packageName) => `FROM python:3.12-slim

WORKDIR /app
COPY . .

ENV PYTHONPATH=/app/src
EXPOSE 8080
CMD ["python", "-m", "${packageName}.service"]
`;

const dockerCompose = `services:
  app:
    build: .
    environment:
      PORT: "8080"
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/ai_project
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - otel-collector

  postgres:
    image: pgvector/pgvector:pg17
    environment:
      POSTGRES_DB: ai_project
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - ./infra/schema.sql:/docker-entrypoint-initdb.d/schema.sql:ro

  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.119.0
    command: ["--config=/etc/otelcol/config.yaml"]
    volumes:
      - ./observability/otel-collector.yaml:/etc/otelcol/config.yaml:ro
`;

const databaseSchema = `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS artifact_versions (
  id bigserial PRIMARY KEY,
  artifact_type text NOT NULL,
  artifact_name text NOT NULL,
  version text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artifact_type, artifact_name, version)
);

CREATE TABLE IF NOT EXISTS evaluation_runs (
  id bigserial PRIMARY KEY,
  model_version text NOT NULL,
  dataset_version text NOT NULL,
  metrics jsonb NOT NULL,
  passed boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  content text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(384)
);

CREATE INDEX IF NOT EXISTS documents_tenant_idx ON documents (tenant_id);
CREATE INDEX IF NOT EXISTS documents_embedding_hnsw_idx
  ON documents USING hnsw (embedding vector_cosine_ops);
`;

const otelConfig = `receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  debug:
    verbosity: basic

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]
`;

const productionRequirements = `# Optional production implementation dependencies.
# The tested baseline remains standard-library only.
fastapi
uvicorn[standard]
pydantic
httpx
langgraph
llama-index
sentence-transformers
psycopg[binary]
pgvector
redis
opentelemetry-api
opentelemetry-sdk
opentelemetry-exporter-otlp
prometheus-client
mlflow
`;

const referencesDocument = `# Technical References

The production recommendations in this repository are grounded in primary
project documentation:

- [Hugging Face task and model hub](https://huggingface.co/tasks)
- [Hugging Face model cards](https://huggingface.co/docs/hub/model-cards)
- [Hugging Face dataset cards](https://huggingface.co/docs/hub/datasets-cards)
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangChain human-in-the-loop](https://docs.langchain.com/oss/python/langchain/human-in-the-loop)
- [pgvector](https://github.com/pgvector/pgvector)
- [OpenTelemetry documentation](https://opentelemetry.io/docs/)

Review current versions and operational guidance before implementing the
optional production stack.
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
  const projectProfile = projectProfiles[blueprint.id];
  if (!projectProfile) {
    throw new Error(`Missing project profile for ${blueprint.id}`);
  }
  const projectName = `${blueprint.slug}-${suffix}`;
  const packageName = pythonPackage(blueprint);
  const records = buildRecords(blueprint);
  const { train, test } = splitRecords(records);
  const model = trainPrototypeModel(blueprint, train);
  const metrics = evaluateModel(model, test);
  const datasetReadme = datasetCard(
    blueprint,
    projectName,
    train,
    test,
    projectProfile
  );
  const modelReadme = modelCard(
    blueprint,
    projectName,
    model,
    metrics,
    projectProfile
  );
  const modelJson = json(model);
  const manifestJson = json(
    projectManifest(blueprint, projectProfile, metrics)
  );

  const files = {
    "pyproject.toml": pyproject(
      projectName,
      packageName,
      blueprint.description
    ),
    [`src/${packageName}/__init__.py`]: `"""${blueprint.title}."""\n`,
    [`src/${packageName}/pipeline.py`]: pipelineSource(),
    [`src/${packageName}/cli.py`]: cliSource(packageName),
    [`src/${packageName}/service.py`]: serviceSource(packageName),
    [`src/${packageName}/real_world.py`]:
      realWorldConnectorSource(projectProfile),
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
      metrics,
      projectProfile
    ),
    "ARCHITECTURE.md": architectureDocument(blueprint, projectProfile),
    "PRODUCTION.md": productionDocument(blueprint, projectProfile),
    "PORTFOLIO.md": portfolioDocument(blueprint, projectProfile),
    "ROADMAP.md": roadmapDocument(blueprint, projectProfile),
    "REFERENCES.md": referencesDocument,
    "MODEL_CARD.md": modelReadme,
    "DATASET_CARD.md": datasetReadme,
    "SECURITY.md": securityDocument(blueprint),
    "config/project.json": manifestJson,
    "requirements-production.txt": productionRequirements,
    "Dockerfile": dockerfile(packageName),
    "docker-compose.yml": dockerCompose,
    "infra/schema.sql": databaseSchema,
    "observability/otel-collector.yaml": otelConfig,
    ".dockerignore": "__pycache__/\n*.pyc\n.git/\n",
    ".gitignore": "__pycache__/\n*.pyc\n.venv/\n.env\ndata/raw/\n",
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
          "data/test.jsonl": jsonl(test),
          "sources.json": json(projectProfile.dataSources),
          "project.json": manifestJson
        }
      },
      model: {
        name: `${projectName}-model`,
        files: {
          "README.md": modelReadme,
          "model.json": modelJson,
          "inference.py": pipelineSource(),
          "evaluation.json": json(metrics),
          "project.json": manifestJson
        }
      }
    }
  };
}
