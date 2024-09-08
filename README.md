# PersistAI

Persistent memory for AI agents. Solve context limits and maintain knowledge across sessions.

## Tech Stack

- **Core**: Node.js (TypeScript), Express
- **Database**: PostgreSQL (pgvector) for long-term semantic storage & GraphRAG
- **Cache**: Redis for low-latency working memory
- **Frontend**: Next.js + React Force Graph + Tailwind CSS

## Features

### 🧠 Core Memory Engine

- **Multi-tier Architecture**: Automatically moves data between Working (Redis) and Long-Term (Postgres) memory.
- **Semantic Search**: Retrieve contexts based on meaning, not just keywords.
- **Automatic Extraction**: LLM-based pipeline to extract facts and relationships from raw text.

### 🕸️ GraphRAG & Reasoning

- **Knowledge Graph**: Stores relationships (edges) between memories for multi-hop reasoning.
- **Triple Extraction**: Automatically identifies `(Subject, Predicate, Object)` from conversations.

### 🖥️ Visual Dashboard

- **Interactive Graph**: 2D/3D visualization of your agent's memory network.
- **Glassmorphism UI**: Beautiful, modern interface built with Next.js.
- **Real-time Insights**: View recent memory access and extraction stats.

### 🔌 Integration & Tools

- **MCP Server**: Full support for Model Context Protocol. Plug directly into Claude Desktop.
- **Memory Consolidation**: "Dreaming" service runs in the background to merge and optimize memories.
- **Stress Testing**: Built-in simulators handling 100K+ token contexts.

### 🛡️ Security

- **PII Redaction**: Auto-removes sensitive data like emails and phone numbers.
- **Field-Level Encryption**: AES-256 encryption for memory content at rest.

## Usage

### Start Core Server

```bash
npm install
docker-compose up -d
npm start
```

### Start Dashboard

```bash
cd web
npm install
npm run dev
```

### Run as MCP Tool

```bash
node dist/index.js --mcp
```

## License

MIT
