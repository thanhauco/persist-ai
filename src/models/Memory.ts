export type MemoryType = 'factual' | 'episodic' | 'procedural' | 'semantic';

export interface Memory {
  id: string;
  userId: string;
  agentId?: string;
  content: string;
  type: MemoryType;
  importance: number;
  embedding?: number[];
  metadata: Record<string, any>;
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
}

export interface SearchResult {
  memory: Memory;
  score: number;
}
