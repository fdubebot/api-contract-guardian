import { describe, expect, test } from 'vitest';
import { parseOpenApi } from '../src/parser/openapiParser.js';
import { diffContracts } from '../src/diff/contractDiff.js';
import { evaluatePolicy, defaultPolicy } from '../src/policy/policyEngine.js';
import { renderMarkdown } from '../src/reporters/markdownReporter.js';

describe('core modules', () => {
  test('parses OpenAPI fixtures', () => {
    const oldApi = parseOpenApi('tests/fixtures/old-api.yaml');
    expect(oldApi.title).toBe('Demo API');
    expect(oldApi.endpoints.length).toBe(3);
  });

  test('detects breaking + non-breaking changes', () => {
    const oldApi = parseOpenApi('tests/fixtures/old-api.yaml');
    const newApi = parseOpenApi('tests/fixtures/new-api.yaml');
    const result = diffContracts(oldApi, newApi);

    expect(result.changes.some((c) => c.type === 'endpoint_removed')).toBe(true);
    expect(result.changes.some((c) => c.type === 'query_param_required_added')).toBe(true);
    expect(result.changes.some((c) => c.type === 'request_body_required_added')).toBe(true);
    expect(result.changes.some((c) => c.type === 'endpoint_added')).toBe(true);
  });

  test('policy evaluation fails default policy on breakage', () => {
    const oldApi = parseOpenApi('tests/fixtures/old-api.yaml');
    const newApi = parseOpenApi('tests/fixtures/new-api.yaml');
    const result = diffContracts(oldApi, newApi);
    const evaluation = evaluatePolicy(result, defaultPolicy);

    expect(evaluation.failed).toBe(true);
    expect(evaluation.violations.length).toBeGreaterThan(0);
  });

  test('markdown reporter includes status', () => {
    const oldApi = parseOpenApi('tests/fixtures/old-api.yaml');
    const newApi = parseOpenApi('tests/fixtures/new-api.yaml');
    const result = diffContracts(oldApi, newApi);
    const evaluation = evaluatePolicy(result, defaultPolicy);

    const md = renderMarkdown(result, evaluation);
    expect(md).toContain('API Contract Guardian Report');
    expect(md).toContain('FAILED');
  });
});
