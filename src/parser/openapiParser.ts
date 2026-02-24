import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { ApiContract, Endpoint, HttpMethod } from '../types/contracts.js';

const METHODS: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

type Dict = Record<string, unknown>;

function parseDoc(filePath: string): Dict {
  const raw = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.yaml' || ext === '.yml') {
    return (yaml.load(raw) as Dict) ?? {};
  }
  return JSON.parse(raw) as Dict;
}

export function parseOpenApi(filePath: string): ApiContract {
  const doc = parseDoc(filePath);
  const endpoints: Endpoint[] = [];

  const paths = (doc.paths as Dict | undefined) ?? {};

  for (const [route, operations] of Object.entries(paths)) {
    const operationRecord = (operations as Dict | undefined) ?? {};

    for (const method of METHODS) {
      const operation = operationRecord[method] as Dict | undefined;
      if (!operation) continue;

      const params = ((operation.parameters as unknown[]) ?? []) as Dict[];
      const requiredQueryParams = params
        .filter((p) => p.in === 'query' && p.required === true)
        .map((p) => String(p.name))
        .sort();

      const requestBody = (operation.requestBody as Dict | undefined) ?? {};
      const responses = (operation.responses as Dict | undefined) ?? {};

      endpoints.push({
        path: route,
        method,
        operationId: typeof operation.operationId === 'string' ? operation.operationId : undefined,
        requestBodyRequired: requestBody.required === true,
        responseStatusCodes: Object.keys(responses).sort(),
        requiredQueryParams
      });
    }
  }

  const info = (doc.info as Dict | undefined) ?? {};

  return {
    title: typeof info.title === 'string' ? info.title : 'Untitled API',
    version: typeof info.version === 'string' ? info.version : 'unknown',
    endpoints
  };
}
