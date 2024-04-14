import { Memory, SearchResult } from '../models/Memory';

export abstract class BaseAdapter {
  abstract store(memory: Memory): Promise<void>;
  abstract retrieve(id: string): Promise<Memory | null>;
  abstract delete(id: string): Promise<void>;
  abstract search(query: string, limit: number, userId: string, agentId?: string): Promise<SearchResult[]>;
}
