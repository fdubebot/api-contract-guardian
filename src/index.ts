import { parseOpenApi } from './parser/openapiParser.js';
import { diffContracts } from './diff/contractDiff.js';
import { evaluatePolicy } from './policy/policyEngine.js';
import { loadPolicy } from './config.js';

export function analyzeContracts(oldSpecPath: string, newSpecPath: string, policyPath?: string) {
  const oldContract = parseOpenApi(oldSpecPath);
  const newContract = parseOpenApi(newSpecPath);
  const result = diffContracts(oldContract, newContract);
  const policy = loadPolicy(policyPath);
  const evaluation = evaluatePolicy(result, policy);

  return { result, evaluation };
}

export * from './types/contracts.js';
