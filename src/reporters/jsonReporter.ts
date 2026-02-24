import { AnalysisResult } from '../types/contracts.js';
import { PolicyEvaluation } from '../policy/policyEngine.js';

export function renderJson(result: AnalysisResult, evaluation: PolicyEvaluation): string {
  return JSON.stringify(
    {
      summary: {
        oldVersion: result.oldVersion,
        newVersion: result.newVersion,
        changeCount: result.changes.length,
        failed: evaluation.failed
      },
      changes: result.changes,
      violations: evaluation.violations
    },
    null,
    2
  );
}
