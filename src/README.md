# Remove Header Parameters Function

This module provides a utility function to remove all header parameters from an OpenAPI 3.0.0 specification.

## Function: `removeHeaderParameters`

Removes all parameters where `in: 'header'` from an OpenAPI specification.

### Parameters
- `openApiSpec` (Object): The OpenAPI specification object

### Returns
- (Object): A new OpenAPI specification object with all header parameters removed

### Features
- ✅ Removes header parameters from all operations (GET, POST, PUT, PATCH, DELETE, etc.)
- ✅ Removes header parameters from path-level parameters
- ✅ Preserves all non-header parameters (query, path, cookie)
- ✅ Creates a deep copy (doesn't mutate the original spec)
- ✅ Cleans up empty parameter arrays

## Usage

### Basic Usage

```javascript
import { removeHeaderParameters } from './remove-header-params.js';

const originalSpec = {
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0.0' },
  paths: {
    '/users': {
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

const modifiedSpec = removeHeaderParameters(originalSpec);
// Result: Only the 'limit' query parameter remains
```

### Working with YAML Files

If you need to work with YAML files, you'll need to install a YAML parser:

```bash
npm install js-yaml
```

Then you can use it like this:

```javascript
import fs from 'fs';
import yaml from 'js-yaml';
import { removeHeaderParameters } from './remove-header-params.js';

// Read and parse YAML file
const yamlContent = fs.readFileSync('openapi.yaml', 'utf8');
const openApiSpec = yaml.load(yamlContent);

// Remove header parameters
const modifiedSpec = removeHeaderParameters(openApiSpec);

// Write back to YAML
const modifiedYaml = yaml.dump(modifiedSpec, { 
  noRefs: true, 
  lineWidth: -1 
});
fs.writeFileSync('openapi-no-headers.yaml', modifiedYaml);
```

## Example Output

**Before:**
```json
{
  "paths": {
    "/api/test": {
      "get": {
        "parameters": [
          { "name": "Authorization", "in": "header", "required": true },
          { "name": "limit", "in": "query", "required": false }
        ]
      }
    }
  }
}
```

**After:**
```json
{
  "paths": {
    "/api/test": {
      "get": {
        "parameters": [
          { "name": "limit", "in": "query", "required": false }
        ]
      }
    }
  }
}
```

## Testing

Run the example to see the function in action:

```bash
node example-usage.js
```

This will demonstrate the function removing header parameters from a sample OpenAPI specification.

## Use Cases

- **API Documentation**: Remove internal headers from public API documentation
- **Client Generation**: Generate client SDKs without header parameter handling
- **Testing**: Create simplified specs for testing purposes
- **Migration**: Remove deprecated authentication headers during API transitions 