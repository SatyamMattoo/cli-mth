#!/usr/bin/env node

import { parseArguments } from './cli.js';
import { processFiles } from './converter.js';
import { watchFiles } from './watcher.js';
import { readFile } from './utils.js';
import * as path from 'path';
import chalk from 'chalk';

async function main() {
  const argv = parseArguments();

  // Load template
  let template = '<html><body>{{content}}</body></html>';
  if (argv.template) {
    try {
      template = await readFile(path.resolve(argv.template));
    } catch (err: any) {
      console.error(chalk.red(`Error reading template file: ${err.message}`));
      process.exit(1);
    }
  }

  // Convert files
  await processFiles(argv.inputDir, argv.outputDir, template, argv.single);

  // Watch if necessary
  if (argv.watch) {
    watchFiles(argv.inputDir, argv.outputDir, template);
  }
}

main().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
