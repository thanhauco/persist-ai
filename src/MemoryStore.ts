import { Memory, SearchResult } from './models/Memory';
import { MemoryTiers } from './MemoryTiers';
import { v4 as uuidv4 } from 'uuid';

export class MemoryStore {
  private tiers: MemoryTiers;

  constructor(tiers: MemoryTiers) {
    this.tiers = tiers;
  }

  async add(content: string, type: 'factual' | 'episodic' | 'procedural' | 'semantic', userId: string, metadata: any = {}): Promise<Memory> {
    const memory: Memory = {
      id: uuidv4(),
      userId,
      content,
      type,
      importance: 1.0, // Default, can be refined by analyzer
      metadata,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      accessCount: 0,
      embedding: metadata.embedding || [] // Expect embedding to be passed or calculated
    };

    await this.tiers.route(memory);
    return memory;
  }

  async recall(query: string, limit: number = 5, userId: string): Promise<SearchResult[]> {
    // 1. fast semantic check in redis (if available) or recent context
    // 2. deep semantic search in postgres
    
    // For MVP: Check Redis for immediate context ? No, strict semantic search is better in PG
    // But we might want to blend results.
    
    // Strategy: Search PG for semantic results
    const results = await this.tiers.getLongTermMemory().search(query, limit, userId);
    return results;
  }

  async getRecentContext(userId: string, limit: number = 10): Promise<Memory[]> {
      // Fetch recent items from Redis
      // This part requires a specialized Redis structure (List or Sorted Set)
      // For now, we reuse the basic retrieve/search from RedisAdapter
      const results = await this.tiers.getWorkingMemory().search('', limit, userId);
      return results.map(r => r.memory);
  }

  async forget(id: string): Promise<void> {
    await this.tiers.getWorkingMemory().delete(id);
    await this.tiers.getLongTermMemory().delete(id);
  }
}
