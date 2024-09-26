import path from "path";
import chalk from "chalk";

import { readFile } from "../utils.js";
import { Args } from "../types/index.js";

export const templateLoader = async (argv: Args): Promise<string> => {
  // Default template path
  const defaultTemplatePath = path.resolve("src/template", "default.html");

  let template: string;

  // Load default template
  try {
    template = await readFile(defaultTemplatePath);
  } catch (err: any) {
    console.error(
      chalk.red(`Error reading default template file: ${err.message}`)
    );
    process.exit(1);
  }

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
