#!/usr/bin/env node
import fs from 'node:fs';
import { Command } from 'commander';
import { analyzeContracts } from './index.js';
import { renderMarkdown } from './reporters/markdownReporter.js';
import { renderJson } from './reporters/jsonReporter.js';

const program = new Command();

program
  .name('acg')
  .description('API Contract Guardian - detect OpenAPI breaking changes')
  .requiredOption('-o, --old <path>', 'Old OpenAPI spec path')
  .requiredOption('-n, --new <path>', 'New OpenAPI spec path')
  .option('-p, --policy <path>', 'Policy config JSON path')
  .option('-f, --format <format>', 'Report format: markdown|json', 'markdown')
  .option('--report <path>', 'Write report to file')
  .parse(process.argv);

const opts = program.opts();
const { result, evaluation } = analyzeContracts(opts.old, opts.new, opts.policy);
const output = opts.format === 'json' ? renderJson(result, evaluation) : renderMarkdown(result, evaluation);

if (opts.report) {
  fs.writeFileSync(opts.report, output, 'utf8');
}

console.log(output);

process.exit(evaluation.failed ? 1 : 0);
