import { MemoryStore } from './MemoryStore';

// Basic Model Context Protocol (MCP) Server implementation over Stdio
// ref: https://modelcontextprotocol.io

export class MCPServer {
  private store: MemoryStore;

  constructor(store: MemoryStore) {
    this.store = store;
  }

  start() {
    console.error('PersistAI MCP Server started on Stdio...');
    
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', async (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      for (const line of lines) {
        try {
          const request = JSON.parse(line);
          await this.handleRequest(request);
        } catch (e) {
          console.error('Failed to parse JSON-RPC:', e);
        }
      }
    });
  }

  async handleRequest(request: any) {
    // Basic JSON-RPC 2.0 handling
    if (request.method === 'tools/list') {
      this.sendResponse(request.id, {
        tools: [
          {
            name: "store_memory",
            description: "Store a new memory (fact, event, or knowledge) for the user.",
            inputSchema: {
              type: "object",
              properties: {
                content: { type: "string" },
                type: { type: "string", enum: ["factual", "episodic", "procedural", "semantic"] },
                userId: { type: "string" }
              },
              required: ["content", "userId"]
            }
          },
          {
            name: "search_memory",
            description: "Search for existing memories based on semantic relevance.",
            inputSchema: {
              type: "object",
              properties: {
                query: { type: "string" },
                userId: { type: "string" },
                limit: { type: "number" }
              },
              required: ["query", "userId"]
            }
          }
        ]
      });
    } 
    else if (request.method === 'tools/call') {
        const { name, arguments: args } = request.params;
        
        if (name === 'store_memory') {
            const mem = await this.store.add(args.content, args.type || 'episodic', args.userId);
            this.sendResponse(request.id, { content: [{ type: "text", text: `Memory stored with ID: ${mem.id}` }] });
        }
        else if (name === 'search_memory') {
            const results = await this.store.recall(args.query, args.limit || 5, args.userId);
            this.sendResponse(request.id, { 
                content: [{ 
                    type: "text", 
                    text: JSON.stringify(results.map(r => r.memory.content)) 
                }] 
            });
        }
        else {
            // Error
        }
    }
  }

  sendResponse(id: any, result: any) {
    const response = {
      jsonrpc: "2.0",
      id,
      result
    };
    process.stdout.write(JSON.stringify(response) + '\n');
  }
}
