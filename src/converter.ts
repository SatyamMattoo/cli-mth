import { marked } from 'marked';
import { readFile, writeFile, readDirectory } from './utils.js';
import * as path from 'path';

export async function convertMarkdownToHTML(inputFilePath: string, outputFilePath: string, template: string) {
  try {
    const markdown = await readFile(inputFilePath);
    const htmlContent = marked(markdown);
    const fullHtml = template.replace('{{content}}', htmlContent as string);
    await writeFile(outputFilePath, fullHtml);
  } catch (error) {
    console.error(`Failed to convert ${inputFilePath}: ${error}`);
  }
}

export async function processFiles(inputDir: string, outputDir: string, template: string, single: boolean) {
  const currentDir = process.cwd();

  if (single) {
    const outputFilePath = path.join(currentDir, outputDir, path.basename(inputDir).replace('.md', '.html'));
    await convertMarkdownToHTML(inputDir, outputFilePath, template);
  } else {
    const files = await readDirectory(inputDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const inputFilePath = path.join(inputDir, file);
        const outputFilePath = path.join(currentDir, outputDir, file.replace('.md', '.html'));
        await convertMarkdownToHTML(inputFilePath, outputFilePath, template);
      }
    }
  }
}
