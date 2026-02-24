import { ApiContract, AnalysisResult, Change } from '../types/contracts.js';

function key(path: string, method: string): string {
  return `${method.toUpperCase()} ${path}`;
}

export function diffContracts(oldContract: ApiContract, newContract: ApiContract): AnalysisResult {
  const changes: Change[] = [];

  const oldMap = new Map(oldContract.endpoints.map((e) => [key(e.path, e.method), e]));
  const newMap = new Map(newContract.endpoints.map((e) => [key(e.path, e.method), e]));

  for (const [k, oldEp] of oldMap.entries()) {
    const newer = newMap.get(k);
    if (!newer) {
      changes.push({
        type: 'endpoint_removed',
        severity: 'breaking',
        message: `${k} was removed`,
        endpoint: oldEp.path,
        method: oldEp.method
      });
      continue;
    }

    const removedStatuses = oldEp.responseStatusCodes.filter((s) => !newer.responseStatusCodes.includes(s));
    for (const status of removedStatuses) {
      changes.push({
        type: 'status_removed',
        severity: 'breaking',
        message: `${k} no longer returns status ${status}`,
        endpoint: oldEp.path,
        method: oldEp.method
      });
    }

    const newlyRequiredParams = newer.requiredQueryParams.filter((p) => !oldEp.requiredQueryParams.includes(p));
    for (const p of newlyRequiredParams) {
      changes.push({
        type: 'query_param_required_added',
        severity: 'breaking',
        message: `${k} now requires query param '${p}'`,
        endpoint: oldEp.path,
        method: oldEp.method
      });
    }

    if (!oldEp.requestBodyRequired && newer.requestBodyRequired) {
      changes.push({
        type: 'request_body_required_added',
        severity: 'breaking',
        message: `${k} now requires a request body`,
        endpoint: oldEp.path,
        method: oldEp.method
      });
    }
  }

  for (const [k, ep] of newMap.entries()) {
    if (!oldMap.has(k)) {
      changes.push({
        type: 'endpoint_added',
        severity: 'non_breaking',
        message: `${k} was added`,
        endpoint: ep.path,
        method: ep.method
      });
    }
  }

  return {
    oldVersion: oldContract.version,
    newVersion: newContract.version,
    changes
  };
}
