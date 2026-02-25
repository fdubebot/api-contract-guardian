# API Contract Guardian

Detect breaking API changes between two OpenAPI specs and fail CI when policy violations are found.

## Features

- Parse OpenAPI **JSON and YAML**
- Supports operation + path-level parameter inheritance
- Compare old vs new contracts across endpoints
- Detect:
  - removed endpoints
  - removed response status codes
  - newly required query parameters
  - newly required header parameters
  - newly required request body
  - added endpoints
- Configurable policy gate
- Output as markdown or JSON
- Exit code `1` when policy fails (CI-friendly)

## Install

```bash
npm install
npm run build
```

## CLI Usage

```bash
node dist/cli.js \
  --old ./openapi-old.yaml \
  --new ./openapi-new.yaml \
  --format markdown
```

Write report to file:

```bash
node dist/cli.js -o old.yaml -n new.yaml --report contract-report.md
```

Use custom policy:

```bash
node dist/cli.js -o old.yaml -n new.yaml --policy ./policy.example.json -f json
```

## Policy File

Use JSON format:

```json
{
  "failOn": ["endpoint_removed", "status_removed", "header_param_required_added"],
  "allowEndpointAdditions": true
}
```

## Development

```bash
npm run lint
npm run test
npm run build
```

## Example Output (Markdown)

```md
# API Contract Guardian Report

- **Old version:** 1.2.0
- **New version:** 2.0.0
- **Total changes:** 4
- **Policy status:** ❌ FAILED
```
