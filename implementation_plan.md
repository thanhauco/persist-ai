# PersistAI - AI Memory System Implementation Plan

A Node.js-based memory layer for AI agents to solve long context & token window limits, with persistent memory across sessions.

## Overview

PersistAI provides a multi-tier memory architecture that:

- Extracts and stores key information from conversations
- Retrieves relevant context using semantic search
- Manages memory lifecycle with consolidation and decay
- Supports Redis (fast/ephemeral) and PostgreSQL (persistent/semantic)

---

## Proposed Changes

### Core Infrastructure

#### [NEW] [package.json](package.json)

Dependencies: `pg`, `redis`, `express`, `js-tiktoken`, `dotenv`, `typescript`, `ts-node`, `pgvector`, `uuid`

#### [NEW] [src/index.ts](src/index.ts)

Main entry point and server initialization

---

### Database Layer

#### [NEW] [src/adapters/BaseAdapter.ts](src/adapters/BaseAdapter.ts)

Abstract interface: `store`, `retrieve`, `delete`, `search`

#### [NEW] [src/adapters/RedisAdapter.ts](src/adapters/RedisAdapter.ts)

- Working memory (session context) with TTL
- Recent memories as sorted sets
- Fast key-value caching

#### [NEW] [src/adapters/PostgresAdapter.ts](src/adapters/PostgresAdapter.ts)

- Long-term persistent storage
- Vector similarity search via pgvector
- JSONB metadata support

#### [NEW] [db/schema.sql](db/schema.sql)

PostgreSQL schema with pgvector extension for embeddings

---

### Memory Engine

#### [NEW] [src/models/Memory.ts](src/models/Memory.ts)

Core memory interface: `id`, `userId`, `content`, `type`, `embedding`, `importance`, `metadata`

#### [NEW] [src/MemoryStore.ts](src/MemoryStore.ts)

Unified interface across tiers:

- `add(memory)` - Store with automatic tier selection
- `recall(query, limit)` - Semantic retrieval
- `forget(id)` - Deletion logic

#### [NEW] [src/MemoryTiers.ts](src/MemoryTiers.ts)

Multi-tier routing logic:
| Tier | Storage | TTL | Use Case |
|------|---------|-----|----------|
| Working | Redis | Session | Current context |
| Short-term | Redis | 24h | Recent interactions |
| Long-term | Postgres | ∞ | Persistent knowledge |

#### [NEW] [src/Extractor.ts](src/Extractor.ts)

LLM-based memory extraction from conversations

---

### Mock Data Generation

#### [NEW] [src/mock/DataGenerator.ts](src/mock/DataGenerator.ts)

Generates realistic test data for conversations, users, and memories.

#### [NEW] [src/mock/fixtures.ts](src/mock/fixtures.ts)

Pre-built fixtures for rapid development.

---

### Long Context Stress Testing

#### [NEW] [src/stress/ContextSimulator.ts](src/stress/ContextSimulator.ts)

Simulates large context windows (8K to 100K+ tokens) using `js-tiktoken`.

#### [NEW] [src/stress/Benchmark.ts](src/stress/Benchmark.ts)

Benchmarks insertion throughput and retrieval latency at scale.

---

### API Layer

#### [NEW] [src/api.ts](src/api.ts)

Express API endpoints for storing, searching, and managing memories.

---

## Project Structure

```
persist-ai/
├── src/
│   ├── adapters/
│   │   ├── BaseAdapter.ts
│   │   ├── RedisAdapter.ts
│   │   └── PostgresAdapter.ts
│   ├── models/
│   │   └── Memory.ts
│   ├── mock/
│   │   ├── DataGenerator.ts
│   │   └── fixtures.ts
│   ├── stress/
│   │   ├── Benchmark.ts
│   │   └── ContextSimulator.ts
│   ├── api.ts
│   ├── Extractor.ts
│   ├── MemoryStore.ts
│   ├── MemoryTiers.ts
│   └── index.ts
├── db/
│   └── schema.sql
├── package.json
├── tsconfig.json
└── README.md
```

---

## Verification Plan

### Automated Tests

- `npm test` - Run unit and integration tests.
- `npm run stress` - Run the stress test suite with 100K token scenarios.

### Manual Verification

1. Start infrastructure: `docker-compose up -d`
2. Seed data: `npm run seed`
3. Test API endpoints via curl or Postman.
