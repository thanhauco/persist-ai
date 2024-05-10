import { Memory, MemoryType } from './models/Memory';
import { RedisAdapter } from './adapters/RedisAdapter';
import { PostgresAdapter } from './adapters/PostgresAdapter';

export class MemoryTiers {
  private redis: RedisAdapter;
  private pg: PostgresAdapter;

  constructor(redis: RedisAdapter, pg: PostgresAdapter) {
    this.redis = redis;
    this.pg = pg;
  }

  // Determine which tier(s) a memory belongs to
  async route(memory: Memory): Promise<void> {
    // 1. All memories go to Working Memory (Redis) for immediate context
    await this.redis.store(memory);

    // 2. Factual, Semantic, and Episodic go to Long Term (Postgres)
    if (['factual', 'semantic', 'episodic'].includes(memory.type)) {
      await this.pg.store(memory);
    }
    
    // 3. Procedural might be codebase patterns, also useful in long term
    if (memory.type === 'procedural') {
        await this.pg.store(memory);
    }
  }

  getWorkingMemory(): RedisAdapter {
    return this.redis;
  }

  getLongTermMemory(): PostgresAdapter {
    return this.pg;
  }
}
