CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255),
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'factual', 'episodic', etc.
    embedding vector(1536),    -- Standard OpenAI embedding size
    importance FLOAT DEFAULT 0.0,
    metadata JSONB DEFAULT '{}',
    access_count INT DEFAULT 0,
    last_accessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS memories_embedding_idx ON memories USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS memories_user_id_idx ON memories(user_id);

CREATE TABLE IF NOT EXISTS memory_edges (
    source_id UUID REFERENCES memories(id) ON DELETE CASCADE,
    target_id UUID REFERENCES memories(id) ON DELETE CASCADE,
    relation VARCHAR(100) NOT NULL, -- e.g. "KNOWS", "PART_OF", "CREATED_BY"
    weight FLOAT DEFAULT 1.0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (source_id, target_id, relation)
);

CREATE INDEX IF NOT EXISTS edges_source_idx ON memory_edges(source_id);
CREATE INDEX IF NOT EXISTS edges_target_idx ON memory_edges(target_id);
