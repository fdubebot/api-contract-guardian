import { AnalysisResult, Change, PolicyConfig } from '../types/contracts.js';

export const defaultPolicy: PolicyConfig = {
  failOn: [
    'endpoint_removed',
    'status_removed',
    'query_param_required_added',
    'header_param_required_added',
    'request_body_required_added'
  ],
  allowEndpointAdditions: true
};

export interface PolicyEvaluation {
  failed: boolean;
  violations: Change[];
}

export function evaluatePolicy(result: AnalysisResult, policy: PolicyConfig = defaultPolicy): PolicyEvaluation {
  const violations = result.changes.filter((c) => {
    if (c.type === 'endpoint_added' && policy.allowEndpointAdditions) return false;
    return policy.failOn.includes(c.type);
  });

  return {
    failed: violations.length > 0,
    violations
  };
}
