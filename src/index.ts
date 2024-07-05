import dotenv from 'dotenv';
import { createApi } from './api';
import { MemoryStore } from './MemoryStore';
import { MemoryTiers } from './MemoryTiers';
import { RedisAdapter } from './adapters/RedisAdapter';
import { PostgresAdapter } from './adapters/PostgresAdapter';

dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  // Initialize adapters
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const pgUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/persist_ai';
  
  const redis = new RedisAdapter(redisUrl);
  const pg = new PostgresAdapter(pgUrl);
  
  // Wire up core engine
  const tiers = new MemoryTiers(redis, pg);
  const store = new MemoryStore(tiers);
  
  // Initialize API
  const app = createApi(store);
  
  app.listen(PORT, () => {
    console.log(`PersistAI server running on port ${PORT}`);
  });
};

start().catch(console.error);
