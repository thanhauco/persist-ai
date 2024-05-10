export class Extractor {
  // Mock LLM Extraction
  // In a real app, this would call OpenAI/Anthropic to parse text into structured memories
  
  async extract(text: string): Promise<Array<{ content: string; type: string; importance: number }>> {
    // Simple heuristic-based extraction for the MVP
    const memories = [];

    if (text.toLowerCase().includes('my name is')) {
      memories.push({
        content: text,
        type: 'factual',
        importance: 0.9
      });
    } else if (text.toLowerCase().includes('remember')) {
       memories.push({
        content: text.replace(/remember/i, '').trim(),
        type: 'episodic',
        importance: 0.8
      });
    } else {
        // Default generic memory
        memories.push({
            content: text,
            type: 'episodic',
            importance: 0.3
        });
    }
    
    return memories;
  }
}
