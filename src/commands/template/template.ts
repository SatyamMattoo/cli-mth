import path from "path";
import chalk from "chalk";

import { readFile } from "../../utils.js";
import { Args } from "../../types/index.js";
import { defaultHTML } from "./default.js";

/**
 * Loads a template file specified by the user, or falls back to the default template.
 *
 * @param {Args} argv - An object containing command line arguments.
 * @return {Promise<string>} A Promise that resolves to the loaded template.
 * @throws {Error} If the user-specified template file cannot be read.
 */
export const templateLoader = async (argv: Args): Promise<string> => {
  let template = defaultHTML; 

  // Load user-specified template if available
  if (argv.template) {
    try {
      template = await readFile(path.resolve(argv.template));
    } catch (err: any) {
      console.error(chalk.red(`Error reading template file: ${err.message}`));
      process.exit(1);
    }
  }
  return template;
};
