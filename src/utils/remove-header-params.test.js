import { describe, it, expect } from 'vitest';
import { removeHeaderParameters } from './remove-header-params.js';

describe('removeHeaderParameters', () => {
  it('should remove header parameters from operation-level parameters', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            parameters: [
              { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
              { name: 'Content-Type', in: 'header', required: false, schema: { type: 'string' } },
              { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    expect(result.paths['/test'].get.parameters).toHaveLength(2);
    expect(result.paths['/test'].get.parameters).toEqual([
      { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ]);
  });

  it('should remove header parameters from path-level parameters', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/users/{id}': {
          parameters: [
            { name: 'X-API-Version', in: 'header', required: true, schema: { type: 'string' } },
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          get: {
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    expect(result.paths['/users/{id}'].parameters).toHaveLength(1);
    expect(result.paths['/users/{id}'].parameters[0]).toEqual({
      name: 'id', in: 'path', required: true, schema: { type: 'string' }
    });
  });

  it('should remove parameters array when all parameters are headers', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            parameters: [
              { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
              { name: 'X-API-Key', in: 'header', required: true, schema: { type: 'string' } }
            ],
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    expect(result.paths['/test'].get.parameters).toBeUndefined();
  });

  it('should handle multiple HTTP methods', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            parameters: [
              { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
              { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } }
            ],
            responses: { '200': { description: 'Success' } }
          },
          post: {
            parameters: [
              { name: 'Content-Type', in: 'header', required: true, schema: { type: 'string' } }
            ],
            responses: { '201': { description: 'Created' } }
          },
          put: {
            parameters: [
              { name: 'X-Custom-Header', in: 'header', required: false, schema: { type: 'string' } },
              { name: 'version', in: 'query', required: true, schema: { type: 'string' } }
            ],
            responses: { '200': { description: 'Updated' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    expect(result.paths['/test'].get.parameters).toHaveLength(1);
    expect(result.paths['/test'].get.parameters[0].name).toBe('limit');
    
    expect(result.paths['/test'].post.parameters).toBeUndefined();
    
    expect(result.paths['/test'].put.parameters).toHaveLength(1);
    expect(result.paths['/test'].put.parameters[0].name).toBe('version');
  });

  it('should preserve cookie parameters', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            parameters: [
              { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
              { name: 'sessionId', in: 'cookie', required: true, schema: { type: 'string' } },
              { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } }
            ],
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    expect(result.paths['/test'].get.parameters).toHaveLength(2);
    expect(result.paths['/test'].get.parameters).toEqual([
      { name: 'sessionId', in: 'cookie', required: true, schema: { type: 'string' } },
      { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } }
    ]);
  });

  it('should handle specs with no parameters', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    expect(result.paths['/test'].get.parameters).toBeUndefined();
  });

  it('should handle empty spec', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' }
    };

    const result = removeHeaderParameters(spec);

    expect(result).toEqual(spec);
  });

  it('should handle spec with no paths', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {}
    };

    const result = removeHeaderParameters(spec);

    expect(result).toEqual(spec);
  });

  it('should not mutate the original spec', () => {
    const originalSpec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            parameters: [
              { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
              { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } }
            ],
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const originalSpecCopy = JSON.parse(JSON.stringify(originalSpec));
    const result = removeHeaderParameters(originalSpec);

    // Original should be unchanged
    expect(originalSpec).toEqual(originalSpecCopy);
    
    // Result should be different
    expect(result).not.toEqual(originalSpec);
    expect(result.paths['/test'].get.parameters).toHaveLength(1);
  });

  it('should handle malformed parameters gracefully', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            parameters: [
              { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
              null, // malformed parameter
              { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
              { name: 'invalid' }, // missing 'in' property
              { name: 'X-Custom', in: 'header', required: false, schema: { type: 'string' } }
            ],
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    expect(result.paths['/test'].get.parameters).toHaveLength(3);
    expect(result.paths['/test'].get.parameters).toEqual([
      null,
      { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
      { name: 'invalid' }
    ]);
  });

  it('should handle all HTTP methods', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Success' } }
          },
          post: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '201': { description: 'Created' } }
          },
          put: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Updated' } }
          },
          patch: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Patched' } }
          },
          delete: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '204': { description: 'Deleted' } }
          },
          head: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Head' } }
          },
          options: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Options' } }
          },
          trace: {
            parameters: [{ name: 'Auth', in: 'header', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Trace' } }
          }
        }
      }
    };

    const result = removeHeaderParameters(spec);

    const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
    methods.forEach(method => {
      expect(result.paths['/test'][method].parameters).toBeUndefined();
    });
  });

  it('should count header parameters correctly', () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test1': {
          parameters: [
            { name: 'X-API-Version', in: 'header', required: true, schema: { type: 'string' } }
          ],
          get: {
            parameters: [
              { name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
              { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } }
            ],
            responses: { '200': { description: 'Success' } }
          }
        },
        '/test2': {
          post: {
            parameters: [
              { name: 'Content-Type', in: 'header', required: true, schema: { type: 'string' } }
            ],
            responses: { '201': { description: 'Created' } }
          }
        }
      }
    };

    // Helper function to count header parameters
    const countHeaderParameters = (spec) => {
      let count = 0;
      if (!spec.paths) return count;
      
      for (const pathKey in spec.paths) {
        const pathItem = spec.paths[pathKey];
        
        if (Array.isArray(pathItem.parameters)) {
          count += pathItem.parameters.filter(param => param && param.in === 'header').length;
        }
        
        const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
        
        for (const method of httpMethods) {
          const operation = pathItem[method];
          
          if (operation && Array.isArray(operation.parameters)) {
            count += operation.parameters.filter(param => param && param.in === 'header').length;
          }
        }
      }
      
      return count;
    };

    expect(countHeaderParameters(spec)).toBe(3);
    
    const result = removeHeaderParameters(spec);
    expect(countHeaderParameters(result)).toBe(0);
  });
}); 