import fs from 'node:fs';
import { PolicyConfig } from './types/contracts.js';
import { defaultPolicy } from './policy/policyEngine.js';

export function loadPolicy(path?: string): PolicyConfig {
  if (!path) return defaultPolicy;
  const raw = fs.readFileSync(path, 'utf8');
  const partial = JSON.parse(raw) as Partial<PolicyConfig>;
  return {
    failOn: partial.failOn ?? defaultPolicy.failOn,
    allowEndpointAdditions: partial.allowEndpointAdditions ?? defaultPolicy.allowEndpointAdditions
  };
}
