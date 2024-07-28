import { encodingForModel } from "js-tiktoken";
import { DataGenerator } from "../mock/DataGenerator";

export class ContextSimulator {
  private encoder;

  constructor() {
    this.encoder = encodingForModel("gpt-4");
  }

  countTokens(text: string): number {
    return this.encoder.encode(text).length;
  }

  generateContext(tokenLimit: number): string {
    let context = "";
    let currentTokens = 0;
    
    // Naively append sentences until we hit the limit
    while (currentTokens < tokenLimit) {
      const sentence = ` This is a filler sentence to consume tokens. Random value: ${Math.random()}.`;
      const tokens = this.countTokens(sentence);
      
      if (currentTokens + tokens > tokenLimit) break;
      
      context += sentence;
      currentTokens += tokens;
    }
    
    console.log(`Generated context with ${currentTokens} tokens (Target: ${tokenLimit})`);
    return context;
  }
}
