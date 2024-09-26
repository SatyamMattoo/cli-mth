import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { readFile } from "./utils.js";
import { Args } from "./types/index.js";

/**
 * Parses command-line arguments and merges them with configuration from .mthclirc.json.
 *
 * @return {Promise<Args>} An object containing the parsed command-line arguments and configuration.
 * @throws {Error} If .mthclirc.json cannot be parsed or if it does not contain valid JSON.
 */
export const parseArguments = async (): Promise<Args> => {
  // Load configuration first
  const config = JSON.parse(await readFile(".mthclirc.json"));

  // Parse command-line arguments
  const argv = yargs(hideBin(process.argv))
    .scriptName("mth")
    .usage(
      "$0 <inputDir> <outputDir> [template]",
      "Convert Markdown files to HTML",
      {
        inputDir: {
          description: "Directory or single Markdown file",
          type: "string",
          demandOption: true,
        },
        outputDir: {
          description: "Directory for output HTML files",
          type: "string",
          demandOption: true,
        },
        template: {
          description: "Path to HTML template",
          type: "string",
        },
        css: {
          description: "CSS file(s) to apply to the HTML",
          type: "array",
          alias: "c",
        },
        watch: {
          alias: "w",
          type: "boolean",
          description: "Watch for changes in Markdown files",
          default: false,
        },
        single: {
          alias: "s",
          type: "boolean",
          description: "Convert a single Markdown file",
          default: false,
        },
        live: {
          alias: "l",
          type: "boolean",
          description: "Start a live server with auto-refresh",
          default: false,
        },
        port: {
          alias: "p",
          type: "number",
          description: "Port for the live server",
          default: 8080,
        },
      }
    )
    .help().argv as unknown as Args;

  // Merge CLI args with config (CLI args take precedence)
  return { ...argv, ...config };
};
