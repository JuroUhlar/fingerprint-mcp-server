/**
 * Removes all header parameters from an OpenAPI 3.0.0 specification
 * @param {Object} openApiSpec - The OpenAPI specification object
 * @returns {Object} - The modified OpenAPI specification with header parameters removed
 */
export function removeHeaderParameters(openApiSpec) {
  // Create a deep copy to avoid mutating the original object
  const modifiedSpec = JSON.parse(JSON.stringify(openApiSpec));

  // Check if the spec has paths
  if (!modifiedSpec.paths || typeof modifiedSpec.paths !== 'object') {
    return modifiedSpec;
  }

  // Iterate through all paths
  for (const pathKey in modifiedSpec.paths) {
    const pathItem = modifiedSpec.paths[pathKey];
    
    if (!pathItem || typeof pathItem !== 'object') {
      continue;
    }

    // HTTP methods that can have parameters
    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
    
    // Iterate through all HTTP methods for this path
    for (const method of httpMethods) {
      const operation = pathItem[method];
      
      if (!operation || typeof operation !== 'object') {
        continue;
      }

      // Remove header parameters from this operation
      if (Array.isArray(operation.parameters)) {
        operation.parameters = operation.parameters.filter(param => {
          // Keep parameters that are not headers
          return !(param && param.in === 'header');
        });
        
        // If no parameters remain, remove the empty array
        if (operation.parameters.length === 0) {
          delete operation.parameters;
        }
      }
    }

    // Also check for path-level parameters (shared across all operations)
    if (Array.isArray(pathItem.parameters)) {
      pathItem.parameters = pathItem.parameters.filter(param => {
        return !(param && param.in === 'header');
      });
      
      // If no parameters remain, remove the empty array
      if (pathItem.parameters.length === 0) {
        delete pathItem.parameters;
      }
    }
  }

  return modifiedSpec;
} 