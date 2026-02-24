import { describe, expect, test } from 'vitest';
import { execSync } from 'node:child_process';

describe('cli integration', () => {
  test('returns non-zero on policy violations', () => {
    let code = 0;
    try {
      execSync('npx tsx src/cli.ts -o tests/fixtures/old-api.yaml -n tests/fixtures/new-api.yaml -f json', {
        stdio: 'pipe'
      });
    } catch (err: unknown) {
      const typed = err as { status?: number; stdout?: string | Buffer };
      code = typed.status ?? 0;
      const stdout = String(typed.stdout ?? '');
      expect(stdout).toContain('"failed": true');
    }

    expect(code).toBe(1);
  });
});
