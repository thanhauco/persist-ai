import express from 'express';
import { MemoryStore } from './MemoryStore';
import { Extractor } from './Extractor';

export const createApi = (store: MemoryStore) => {
  const app = express();
  const extractor = new Extractor();

  app.use(express.json());

  // Store a new memory manually
  app.post('/memories', async (req, res) => {
    try {
      const { content, type, userId, metadata } = req.body;
      const memory = await store.add(content, type, userId, metadata);
      res.json(memory);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to store memory' });
    }
  });

  // Semantic search
  app.get('/memories/search', async (req, res) => {
    try {
      const { query, userId, limit } = req.query;
      if (!userId || typeof userId !== 'string') {
          return res.status(400).json({ error: 'userId required' });
      }
      const results = await store.recall(
        query as string, 
        parseInt(limit as string) || 5, 
        userId
      );
      res.json(results);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to search memories' });
    }
  });

  // Extract and store from conversation
  app.post('/extract', async (req, res) => {
    try {
      const { text, userId } = req.body;
      const extractedItems = await extractor.extract(text);
      
      const stored = [];
      for (const item of extractedItems) {
         // Naive assumption: all extracted items are factual or episodic
         const memory = await store.add(
             item.content, 
             item.type as any, 
             userId, 
             { source: 'extraction', original_text: text }
         );
         stored.push(memory);
      }
      
      res.json({ extracted: stored.length, memories: stored });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Extraction failed' });
    }
  });
  
  app.delete('/memories/:id', async (req, res) => {
      try {
          await store.forget(req.params.id);
          res.sendStatus(204);
      } catch (e) {
          res.status(500).json({ error: 'Delete failed' });
      }
  });

  return app;
};
