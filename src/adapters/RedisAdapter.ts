import { createClient } from 'redis';
import { Memory, SearchResult } from '../models/Memory';
import { BaseAdapter } from './BaseAdapter';

export class RedisAdapter extends BaseAdapter {
  private client;

  constructor(url: string = 'redis://localhost:6379') {
    super();
    this.client = createClient({ url });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect().catch(console.error);
  }

  async store(memory: Memory): Promise<void> {
    // Safety truncation for Redis keys/values
    if (memory.content.length > 100000) {
        memory.content = memory.content.slice(0, 100000) + '...[TRUNCATED]';
    }

    const key = `memory:${memory.userId}:${memory.id}`;
    await this.client.set(key, JSON.stringify(memory));
    // Factual data persists longer in cache vs others
    if (memory.type === 'factual') {
      await this.client.expire(key, 3600 * 24); // 24h
    } else {
      await this.client.expire(key, 3600); // 1h
    }
  }

  async retrieve(id: string): Promise<Memory | null> {
    // Basic retrieval assumption: we'd need a lookup or scan pattern in real app
    // For now, scan broadly (inefficient but works for prototype) or rely on direct key knowledge
    // To fix the "retrieve by ID without user ID" issue, we'll scan
    const keys = await this.client.keys(`memory:*:${id}`);
    if (keys.length === 0) return null;
    
    const data = await this.client.get(keys[0]);
    return data ? JSON.parse(data) : null;
  }

  async delete(id: string): Promise<void> {
    const keys = await this.client.keys(`memory:*:${id}`);
    for (const key of keys) {
      await this.client.del(key);
    }
  }

  async search(query: string, limit: number, userId: string): Promise<SearchResult[]> {
    // Naive implementation: scan user's keys and simple string match
    // In production, use RediSearch
    const keys = await this.client.keys(`memory:${userId}:*`);
    const results: SearchResult[] = [];
    
    for (const key of keys) {
      if (results.length >= limit) break;
      const data = await this.client.get(key);
      if (data) {
        const memory: Memory = JSON.parse(data);
        // Simple content match
        if (memory.content.toLowerCase().includes(query.toLowerCase())) {
          results.push({ memory, score: 0.5 }); // Static score for exact match
        }
      }
    }
    return results;
  }
}
