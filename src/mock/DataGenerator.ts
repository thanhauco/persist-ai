import { v4 as uuidv4 } from 'uuid';
import { Memory } from '../models/Memory';

export class DataGenerator {
  
  static generateUser(): any {
    return {
      id: uuidv4(),
      name: `User_${Math.floor(Math.random() * 1000)}`,
      preferences: {
        theme: Math.random() > 0.5 ? 'dark' : 'light',
        language: 'en'
      }
    };
  }

  static generateConversation(length: number = 10): string[] {
    const topics = ['AI architecture', 'Postgres vs Mongo', 'Space travel', 'Cooking recipes', 'Quantum mechanics'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    const messages = [];
    for (let i = 0; i < length; i++) {
      if (i % 2 === 0) {
        messages.push(`User: Tell me more about ${topic}. Detail level ${i}`);
      } else {
        messages.push(`Agent: Here is some information about ${topic}. It is very fascinating. Point ${i}`);
      }
    }
    return messages;
  }

  static generateMemory(userId: string, type: 'factual' | 'episodic' | 'procedural' | 'semantic' = 'episodic'): Memory {
      return {
          id: uuidv4(),
          userId: userId,
          content: `Random memory content about ${Math.random().toString(36).substring(7)}`,
          type: type,
          importance: Math.random(),
          metadata: { source: 'simulation' },
          createdAt: new Date(),
          lastAccessedAt: new Date(),
          accessCount: 0,
          embedding: Array(1536).fill(0).map(() => Math.random()) // Mock embedding
      };
  }

  static generateBatch(userId: string, count: number): Memory[] {
      const batch = [];
      for (let i=0; i<count; i++) {
          batch.push(this.generateMemory(userId));
      }
      return batch;
  }
}
