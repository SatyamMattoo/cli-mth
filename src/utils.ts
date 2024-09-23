import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

export async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error: any) {
    console.error(chalk.red(`Error reading file ${filePath}: ${error.message}`));
    throw error;
  }
}

export async function writeFile(outputFilePath: string, content: string): Promise<void> {
  const outputDir = path.dirname(outputFilePath);
  try {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputFilePath, content);
    console.log(chalk.green(`Converted: ${outputFilePath}`));
  } catch (error: any) {
    console.error(chalk.red(`Error writing file ${outputFilePath}: ${error.message}`));
    throw error;
  }
}

export async function readDirectory(dirPath: string): Promise<string[]> {
  try {
    return await fs.readdir(dirPath);
  } catch (error: any) {
    console.error(chalk.red(`Error reading directory ${dirPath}: ${error.message}`));
    throw error;
  }
}
