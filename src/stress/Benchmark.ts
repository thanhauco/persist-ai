import { MemoryStore } from '../MemoryStore';
import { DataGenerator } from '../mock/DataGenerator';
import { performance } from 'perf_hooks';

export class Benchmark {
  private store: MemoryStore;

  constructor(store: MemoryStore) {
    this.store = store;
  }

  async runInsertionTest(count: number, userId: string): Promise<number> {
    const memories = DataGenerator.generateBatch(userId, count);
    const start = performance.now();
    
    // Sequential insertion to test raw throughput (could be parallelized)
    for (const mem of memories) {
      await this.store.add(mem.content, mem.type, userId, mem.metadata);
    }
    
    const duration = performance.now() - start;
    console.log(`Inserted ${count} memories in ${duration.toFixed(2)}ms`);
    return duration;
  }

  async runSearchTest(query: string, iterations: number, userId: string): Promise<number> {
     const start = performance.now();
     for (let i=0; i<iterations; i++) {
         await this.store.recall(query, 5, userId);
     }
     const duration = performance.now() - start;
     const avg = duration / iterations;
     console.log(`Search avg latency: ${avg.toFixed(2)}ms over ${iterations} iterations`);
     return avg;
  }
}
