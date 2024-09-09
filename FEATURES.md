# PersistAI - Features & Capabilities

PersistAI acts as a **Cognitive Memory Layer** for AI agents, providing capabilities that go far beyond standard vector databases or simple RAG/chat-history implementations.

## 1. 🧠 Core Memory Engine

The heart of PersistAI is a multi-tier storage architecture designed to mimic human memory systems.

- **Multi-Tier Architecture**:
  - **Working Memory (Redis)**: Ultra-low latency storage for immediate context and active conversational threads. Automatically expires (TTL) to keep context fresh.
  - **Long-Term Memory (PostgreSQL + pgvector)**: Persistent, semantic storage for facts, events, and knowledge that needs to be retained indefinitely.
- **Semantic Search**:
  - Uses high-dimensional vector embeddings (via OpenAI models) to retrieve memories based on _meaning_, not just keyword matching.
  - Enables the agent to recall "Who is my favorite author?" even if the stored memory was "I really love the works of Brandon Sanderson."

## 2. 🕸️ Knowledge Graph (GraphRAG)

Moving beyond flat text chunks, PersistAI understands relationships between entities.

- **Structure**: Stores data as a graph of nodes (Memories) and edges (Relationships).
- **Triple Extraction**: Automatically parses unstructured text into structured triples: `(Subject, Predicate, Object)`.
  - _Example_: "I work at Google" → `(User, WORKS_AT, Google)`
- **Multi-Hop Reasoning**: Enables the system to traverse edges to find indirect connections that vector search would miss.
  - _Scenario_: User asks "Can I visit you?" → Agent sees `(Agent, LOCATED_IN, Server)` and `(User, LOCATED_IN, California)` to form an answer.

## 3. 💤 Memory Consolidation ("Dreaming")

PersistAI includes a background service inspired by biological sleep cycles to optimize knowledge.

- **The Consolidator**: A background process that runs periodically to analyze recent memories.
- **Optimization Goals**:
  - **Merging**: Combines 5 fragmented memories about "Planning a vacation" into a single, cohesive summary memory.
  - **Decay/Pruning**: Identifies low-value, repetitive, or outdated information for archival or deletion.
  - **Insight Generation**: Detects patterns across long timeframes to form new "semantic" knowledge.

## 4. 🛡️ Enterprise-Grade Security

Built with privacy and data protection as first-class citizens.

- **PII Redaction**:
  - A Sanitizer layer automatically scans incoming text for Personally Identifiable Information (PII) like email addresses, phone numbers, and potential credit card patterns.
  - These are redacted _before_ hitting the database or LLM embedding service.
- **Field-Level Encryption**:
  - Memory content is encrypted at rest using **AES-256**.
  - Even if a database dump is leaked, the actual "thoughts" and memories of the agent remain unreadable without the specific decryption keys.

## 5. 🔌 Universal integration (MCP)

PersistAI is designed to be the shared brain for _any_ agentic workflow.

- **Model Context Protocol (MCP)**:
  - Implements the official MCP standard, allowing PersistAI to plug-and-play with **Claude Desktop**, **Cursor**, and other MCP-compliant tools.
  - Exposes `store_memory` and `search_memory` tools automatically.
- **REST API**:
  - Standard Express-based API for custom integrations (Python scripts, web apps, etc.).

## 6. 🖥️ Visual Dashboard

A "Window into the Mind" of the agent.

- **Knowledge Graph Visualization**:
  - A 2D/3D interactive graph (using `react-force-graph`) showing how memories cluster and connect.
- **Real-Time Insights**:
  - View recent ingestions, extraction confidence scores, and relation types.
- **Modern UI**:
  - Built with **Next.js 14**, **Tailwind CSS**, and a "Glassmorphism" aesthetic for a premium user experience.
