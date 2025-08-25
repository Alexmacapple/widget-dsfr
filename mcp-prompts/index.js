#!/usr/bin/env node

/**
 * MCP Server Entry Point for Prompt Generation System
 * Compatible with Claude Desktop and Claude CLI
 * Implements JSON-RPC 2.0 protocol
 */

const PromptMCPServer = require('./server');

async function main() {
  console.error('Starting MCP Prompts Server...');
  
  const server = new PromptMCPServer();
  
  // Read from stdin
  process.stdin.setEncoding('utf8');
  
  let buffer = '';
  process.stdin.on('data', async (chunk) => {
    buffer += chunk;
    
    // Try to parse complete JSON messages
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const request = JSON.parse(line);
          
          // Build JSON-RPC response
          const response = {
            jsonrpc: '2.0',
            id: request.id
          };
          
          try {
            const result = await server.handleRequest(request);
            response.result = result;
          } catch (error) {
            response.error = {
              code: -32603,
              message: error.message
            };
          }
          
          // Send response
          process.stdout.write(JSON.stringify(response) + '\n');
          
        } catch (parseError) {
          // Invalid JSON
          const errorResponse = {
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700,
              message: 'Parse error',
              data: parseError.message
            }
          };
          process.stdout.write(JSON.stringify(errorResponse) + '\n');
        }
      }
    }
  });

  // Handle errors gracefully
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      }
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  });

  // Keep process alive
  process.stdin.resume();
}

// Start server
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});