import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Args {
  inputDir: string;
  outputDir: string;
  template?: string;
  watch: boolean;
  single: boolean;
}

export const parseArguments = (): Args => {
  return yargs(hideBin(process.argv))
    .scriptName('mth')
    .usage('$0 <inputDir> <outputDir> [template]', 'Convert Markdown files to HTML', {
      inputDir: {
        description: 'Directory or single Markdown file',
        type: 'string',
        demandOption: true,
      },
      outputDir: {
        description: 'Directory for output HTML files',
        type: 'string',
        demandOption: true,
      },
      template: {
        description: 'Path to HTML template',
        type: 'string',
      },
      watch: {
        alias: 'w',
        type: 'boolean',
        description: 'Watch for changes in Markdown files',
        default: false,
      },
      single: {
        alias: 's',
        type: 'boolean',
        description: 'Convert a single Markdown file',
        default: false,
      },
    })
    .help()
    .argv as unknown as Args;
}