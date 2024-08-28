import { Pool } from 'pg';
import pgvector from 'pgvector/pg';
import { Memory, SearchResult } from '../models/Memory';
import { BaseAdapter } from './BaseAdapter';

export class PostgresAdapter extends BaseAdapter {
  private pool;

  constructor(connectionString: string = 'postgresql://localhost:5432/persist_ai') {
    super();
    this.pool = new Pool({ connectionString });
    this.pool.on('connect', async (client) => {
        // Register pgvector type parser just in case
        await pgvector.registerType(client);
    });
  }

  async store(memory: Memory): Promise<void> {
    const query = `
      INSERT INTO memories (id, user_id, agent_id, content, type, embedding, importance, metadata, created_at, last_accessed_at, access_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        embedding = EXCLUDED.embedding,
        last_accessed_at = EXCLUDED.last_accessed_at,
        access_count = EXCLUDED.access_count;
    `;
    
    // Format embedding for pgvector: '[1.0, 2.0, 3.0]'
    const embeddingStr = memory.embedding ? JSON.stringify(memory.embedding) : null;

    await this.pool.query(query, [
      memory.id,
      memory.userId,
      memory.agentId,
      memory.content,
      memory.type,
      embeddingStr,
      memory.importance,
      memory.metadata,
      memory.createdAt,
      memory.lastAccessedAt,
      memory.accessCount,
    ]);
  }

  async retrieve(id: string): Promise<Memory | null> {
    const res = await this.pool.query('SELECT * FROM memories WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapRowToMemory(res.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM memories WHERE id = $1', [id]);
  }

  async search(query: string, limit: number, userId: string): Promise<SearchResult[]> {
    // Note: 'query' here is expected to be an embedding vector for semantic search
    // But since the interface accepts string, we usually need an external step to convert text -> vector
    // For this Mock/MVP, let's assume if it is NOT JSON-array-like, it's text search (ILIKE),
    // and if it looks like a vector, we do vector search.
    
    let isVector = false;
    if (query.startsWith('[') && query.endsWith(']')) {
       isVector = true;
    }

    if (isVector) {
        // Semantic search using cosine distance (<=>)
        const sql = `
            SELECT *, 1 - (embedding <=> $1) as score 
            FROM memories 
            WHERE user_id = $2
            ORDER BY embedding <=> $1 
            LIMIT $3
        `;
        const res = await this.pool.query(sql, [query, userId, limit]);
        return res.rows.map(row => ({
            memory: this.mapRowToMemory(row),
            score: row.score
        }));
    } else {
        // Keyword search
        const sql = `
            SELECT *, 0.0 as score
            FROM memories
            WHERE user_id = $2 AND content ILIKE $1
            LIMIT $3
        `;
        const res = await this.pool.query(sql, [`%${query}%`, userId, limit]);
        return res.rows.map(row => ({
            memory: this.mapRowToMemory(row),
            score: row.score
        }));
    }
  }

  async createEdge(sourceId: string, targetId: string, relation: string, weight: number = 1.0) {
      const sql = `
        INSERT INTO memory_edges (source_id, target_id, relation, weight)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (source_id, target_id, relation) DO UPDATE SET weight = $4
      `;
      await this.pool.query(sql, [sourceId, targetId, relation, weight]);
  }

  async getRelatedMemories(id: string, relationType?: string): Promise<any[]> {
      let sql = `
        SELECT m.*, e.relation, e.weight
        FROM memory_edges e
        JOIN memories m ON e.target_id = m.id
        WHERE e.source_id = $1
      `;
      const params = [id];
      if (relationType) {
          sql += ` AND e.relation = $2`;
          params.push(relationType);
      }
      
      const res = await this.pool.query(sql, params);
      return res.rows.map(row => ({
          ...this.mapRowToMemory(row),
          relation: row.relation,
          weight: row.weight
      }));
  }

  private mapRowToMemory(row: any): Memory {
    return {
      id: row.id,
      userId: row.user_id,
      agentId: row.agent_id,
      content: row.content,
      type: row.type,
      embedding: Array.isArray(row.embedding) ? row.embedding : JSON.parse(row.embedding || '[]'),
      importance: row.importance,
      metadata: row.metadata,
      createdAt: row.created_at,
      lastAccessedAt: row.last_accessed_at,
      accessCount: row.access_count
    };
  }
}
