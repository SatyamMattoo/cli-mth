#!/usr/bin/env node
import chalk from "chalk";

import { parseArguments } from "./cli.js";
import { watchFiles } from "./commands/watcher.js";
import { processFiles } from "./commands/convert.js";
import { templateLoader } from "./commands/template/template.js";

/**
 * Asynchronously executes the main function.
 * Loads arguments, loads template, converts files, and watches for changes if necessary.
 *
 * @return {Promise<void>} A promise that resolves when the function completes.
 */
async function main() {
  // Load arguments
  const argv = await parseArguments();
  // Load template
  let template = await templateLoader(argv);
  // Convert files
  await processFiles(
    argv.inputDir,
    argv.outputDir,
    template,
    argv.single,
    argv.css
  );
  if (argv.live && !argv.watch) {
    console.log(
      chalk.yellow(
        "You need to watch for changes in order to use live server. Use --watch or -w flag to do that."
      )
    );
  }
  // Watch if necessary
  if (argv.watch) {
    await watchFiles(
      argv.inputDir,
      argv.outputDir,
      argv.live,
      argv.port,
      argv.css,
      template
    );
  }
}

main().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
