# PLAN - API Contract Guardian

## Objective
Build a substantial new tool in a new repo that performs contract governance for OpenAPI specs, suitable for CI gating.

## Scope
1. **Core parser module**
   - Parse OpenAPI JSON/YAML into normalized endpoint model.
2. **Diff engine module**
   - Detect meaningful API changes (removed endpoints/statuses, new required inputs, additions).
3. **Policy engine module**
   - Configurable fail rules for different change types.
4. **Reporting module**
   - Markdown and JSON outputs for humans + CI tooling.
5. **CLI module**
   - Command-line interface with exit codes for CI integration.
6. **Tests**
   - Unit tests for parser/diff/policy/reporters.
   - Integration/e2e-style CLI test on fixture specs.
7. **Docs**
   - README with installation, examples, policy customization, CI usage.

## Implementation Steps
- [x] Scaffold TypeScript project with lint/test/build.
- [x] Implement parser, diff, policy, reporting, and CLI modules.
- [ ] Add fixture OpenAPI files and tests (unit + integration).
- [ ] Document usage and examples.
- [ ] Run lint/test/build.
- [ ] Commit and push to GitHub.

## Risks / Mitigations
- **OpenAPI complexity**: start with high-value subset and document supported scope.
- **False positives in CI**: configurable policy file to tune strictness.
