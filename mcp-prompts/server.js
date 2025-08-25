#!/usr/bin/env node

/**
 * MCP Server for Modular Prompt System
 * Provides prompt generation, optimization, and management via MCP protocol
 */

const PromptAssembler = require('../prompts/assembler');
const fs = require('fs').promises;
const path = require('path');

class PromptMCPServer {
  constructor() {
    this.assembler = new PromptAssembler();
    this.cache = new Map();
  }

  /**
   * List all available MCP tools
   */
  async listTools() {
    return {
      tools: [
        {
          name: 'generate_prompt',
          description: 'Generate an optimized prompt for widget creation',
          inputSchema: {
            type: 'object',
            properties: {
              dataset: {
                type: 'string',
                description: 'Dataset name (signalconso, budget-vert, etc.)',
                enum: ['signalconso', 'annuaire-dgccrf', 'budget-vert', 'tarifs-bancaires']
              },
              widget: {
                type: 'string',
                description: 'Widget type',
                enum: ['table', 'chart', 'map', 'kpi', 'facets']
              },
              query: {
                type: 'string',
                description: 'User query describing what to create'
              },
              minimal: {
                type: 'boolean',
                description: 'Generate minimal prompt (less tokens)',
                default: false
              },
              includeExamples: {
                type: 'boolean',
                description: 'Include code examples',
                default: false
              }
            },
            required: ['dataset', 'widget', 'query']
          }
        },
        {
          name: 'list_modules',
          description: 'List all available prompt modules',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Module category to list',
                enum: ['core', 'datasets', 'widgets', 'examples', 'templates', 'all']
              }
            }
          }
        },
        {
          name: 'get_module',
          description: 'Get content of a specific module',
          inputSchema: {
            type: 'object',
            properties: {
              module_path: {
                type: 'string',
                description: 'Path to module (e.g., core/task-description)'
              }
            },
            required: ['module_path']
          }
        },
        {
          name: 'estimate_tokens',
          description: 'Estimate token count for a prompt',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'Text to analyze'
              }
            },
            required: ['text']
          }
        },
        {
          name: 'optimize_prompt',
          description: 'Optimize a prompt to reduce tokens',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'Prompt to optimize'
              },
              target_tokens: {
                type: 'number',
                description: 'Target token count (optional)'
              }
            },
            required: ['prompt']
          }
        },
        {
          name: 'batch_generate',
          description: 'Generate multiple prompts at once',
          inputSchema: {
            type: 'object',
            properties: {
              requests: {
                type: 'array',
                description: 'Array of prompt requests',
                items: {
                  type: 'object',
                  properties: {
                    dataset: { type: 'string' },
                    widget: { type: 'string' },
                    query: { type: 'string' }
                  }
                }
              }
            },
            required: ['requests']
          }
        }
      ]
    };
  }

  /**
   * Handle tool calls
   */
  async callTool(name, args) {
    switch (name) {
      case 'generate_prompt':
        return await this.generatePrompt(args);
      
      case 'list_modules':
        return await this.listModules(args);
      
      case 'get_module':
        return await this.getModule(args);
      
      case 'estimate_tokens':
        return await this.estimateTokens(args);
      
      case 'optimize_prompt':
        return await this.optimizePrompt(args);
      
      case 'batch_generate':
        return await this.batchGenerate(args);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  /**
   * Generate a prompt
   */
  async generatePrompt(args) {
    const { dataset, widget, query, minimal = false, includeExamples = false } = args;

    try {
      // Check cache
      const cacheKey = `${dataset}-${widget}-${minimal}-${includeExamples}`;
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        // Interpolate query
        cached.prompt = cached.prompt.replace('{{USER_QUERY}}', query);
        return cached;
      }

      // Load modules
      await this.assembler.loadModules({
        dataset,
        widgetType: widget,
        includeExamples
      });

      // Set variables
      this.assembler.setVariables({
        DATASET_NAME: dataset,
        WIDGET_TYPE: widget,
        WIDGET_ID: `${dataset}-${widget}-${Date.now()}`,
        API_ENDPOINT: 'https://data.economie.gouv.fr/api/v2',
        USER_QUERY: query,
        // Add common variables
        DATASET: dataset,
        TABLE_TITLE: `Table ${dataset}`,
        CHART_TITLE: `Graphique ${dataset}`,
        MAP_TITLE: `Carte ${dataset}`,
        KPI_LABEL: 'Indicateur clé'
      });

      // Build prompt
      let prompt;
      if (minimal) {
        prompt = this.assembler.buildMinimal(query, widget);
      } else {
        prompt = this.assembler.build({
          userQuery: query,
          includeDataset: true,
          includeExamples,
          outputFormat: 'html'
        });
      }

      // Optimize
      prompt = this.assembler.optimize(prompt);

      // Analyze
      const tokens = this.assembler.estimateTokens(prompt);

      const result = {
        prompt,
        metadata: {
          dataset,
          widget,
          tokens,
          minimal,
          includeExamples,
          generated: new Date().toISOString()
        }
      };

      // Cache result (without specific query)
      this.cache.set(cacheKey, { ...result });

      return result;

    } catch (error) {
      return {
        error: error.message,
        suggestion: 'Vérifiez que le dataset et le type de widget existent'
      };
    }
  }

  /**
   * List available modules
   */
  async listModules(args) {
    const { category = 'all' } = args;
    const basePath = path.join(__dirname, '..', 'prompts');
    const modules = {};

    const categories = category === 'all' 
      ? ['core', 'datasets', 'widgets', 'examples', 'templates']
      : [category];

    for (const cat of categories) {
      try {
        const categoryPath = path.join(basePath, cat);
        const files = await fs.readdir(categoryPath);
        modules[cat] = files
          .filter(f => f.endsWith('.md'))
          .map(f => f.replace('.md', ''));
      } catch (error) {
        modules[cat] = [];
      }
    }

    return {
      modules,
      total: Object.values(modules).flat().length
    };
  }

  /**
   * Get module content
   */
  async getModule(args) {
    const { module_path } = args;
    
    try {
      const content = await this.assembler.loadModule(module_path);
      const tokens = this.assembler.estimateTokens(content);
      
      return {
        content,
        metadata: {
          path: module_path,
          tokens,
          lines: content.split('\n').length
        }
      };
    } catch (error) {
      return {
        error: `Module not found: ${module_path}`,
        suggestion: 'Use list_modules to see available modules'
      };
    }
  }

  /**
   * Estimate tokens
   */
  async estimateTokens(args) {
    const { text } = args;
    const tokens = this.assembler.estimateTokens(text);
    
    return {
      tokens,
      characters: text.length,
      words: text.split(/\s+/).length,
      lines: text.split('\n').length
    };
  }

  /**
   * Optimize prompt
   */
  async optimizePrompt(args) {
    const { prompt, target_tokens } = args;
    
    const originalTokens = this.assembler.estimateTokens(prompt);
    let optimized = this.assembler.optimize(prompt);
    
    // Further optimization if target specified
    if (target_tokens && originalTokens > target_tokens) {
      // Remove examples if present
      optimized = optimized.replace(/## Examples[\s\S]*?(?=\n#)/g, '');
      
      // Compress code blocks more aggressively
      optimized = this.assembler.compressCodeExamples(optimized);
      
      // Remove optional sections
      if (this.assembler.estimateTokens(optimized) > target_tokens) {
        optimized = optimized.replace(/### .* \(optionnel\)[\s\S]*?(?=\n##)/g, '');
      }
    }
    
    const optimizedTokens = this.assembler.estimateTokens(optimized);
    
    return {
      original: {
        tokens: originalTokens,
        length: prompt.length
      },
      optimized: {
        tokens: optimizedTokens,
        length: optimized.length,
        prompt: optimized
      },
      savings: {
        tokens: originalTokens - optimizedTokens,
        percentage: Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100)
      }
    };
  }

  /**
   * Batch generate prompts
   */
  async batchGenerate(args) {
    const { requests } = args;
    const results = [];
    
    for (const request of requests) {
      const result = await this.generatePrompt(request);
      results.push({
        request,
        ...result
      });
    }
    
    const totalTokens = results.reduce((sum, r) => sum + (r.metadata?.tokens || 0), 0);
    
    return {
      results,
      summary: {
        total: results.length,
        totalTokens,
        averageTokens: Math.round(totalTokens / results.length)
      }
    };
  }

  /**
   * Handle MCP protocol
   */
  async handleRequest(request) {
    const { method, params = {} } = request;

    switch (method) {
      case 'initialize':
        return {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'mcp-prompts',
            version: '1.0.0'
          }
        };
      
      case 'tools/list':
        return await this.listTools();
      
      case 'tools/call':
        const { name, arguments: args } = params;
        const result = await this.callTool(name, args);
        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
            }
          ]
        };
      
      case 'ping':
        return { status: 'ok', timestamp: new Date().toISOString() };
      
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
}

// Export for use in index.js

module.exports = PromptMCPServer;