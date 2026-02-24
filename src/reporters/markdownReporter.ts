import { AnalysisResult } from '../types/contracts.js';
import { PolicyEvaluation } from '../policy/policyEngine.js';

export function renderMarkdown(result: AnalysisResult, evaluation: PolicyEvaluation): string {
  const lines: string[] = [];
  lines.push(`# API Contract Guardian Report`);
  lines.push('');
  lines.push(`- **Old version:** ${result.oldVersion}`);
  lines.push(`- **New version:** ${result.newVersion}`);
  lines.push(`- **Total changes:** ${result.changes.length}`);
  lines.push(`- **Policy status:** ${evaluation.failed ? '❌ FAILED' : '✅ PASSED'}`);
  lines.push('');

  if (result.changes.length === 0) {
    lines.push('No changes detected.');
    return lines.join('\n');
  }

  lines.push('## Changes');
  lines.push('');
  for (const change of result.changes) {
    lines.push(`- [${change.severity}] \`${change.type}\` - ${change.message}`);
  }

  if (evaluation.violations.length > 0) {
    lines.push('');
    lines.push('## Violations');
    lines.push('');
    for (const v of evaluation.violations) {
      lines.push(`- ${v.message}`);
    }
  }

  return lines.join('\n');
}
