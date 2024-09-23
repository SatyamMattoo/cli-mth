import chokidar from 'chokidar';
import chalk from 'chalk';
import * as path from 'path';
import { convertMarkdownToHTML } from './converter.js';

export function watchFiles(inputDir: string, outputDir: string, template: string) {
  console.log(chalk.blue(`Watching for changes in: ${inputDir}`));

  const watcher = chokidar.watch(`${inputDir}`, {
    //@ts-ignore
    ignored: (path, stats) => stats?.isFile() && !path.endsWith('.md'),
    persistent: true,
  });

  watcher.on('change', (filePath) => {
    console.log(chalk.blue(`Detected change in: ${filePath}`));
    const fileName = path.basename(filePath, '.md') + '.html';
    const outputFilePath = path.join(process.cwd(), outputDir, fileName);
    convertMarkdownToHTML(filePath, outputFilePath, template);
  });
}
