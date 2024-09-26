import chalk from "chalk";
import * as path from "path";
import * as fs from "fs/promises";

/**
 * Reads the contents of a file as a string.
 *
 * @param {string} filePath - The path to the file to be read.
 * @return {Promise<string>} A promise that resolves to the contents of the file as a string.
 * @throws {Error} If there is an error reading the file.
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error: any) {
    console.error(
      chalk.red(`Error reading file ${filePath}: ${error.message}`)
    );
    throw error;
  }
}

/**
 * Writes the given content to the specified output file path.
 * If the output directory does not exist, it creates it recursively.
 * Logs a success message if the file is successfully written.
 * Throws an error if there is an error writing the file.
 *
 * @param {string} outputFilePath - The path to the output file.
 * @param {string} content - The content to write to the file.
 * @return {Promise<void>} A promise that resolves when the file is successfully written.
 * @throws {Error} If there is an error writing the file.
 */
export async function writeFile(
  outputFilePath: string,
  content: string
): Promise<void> {
  const outputDir = path.dirname(outputFilePath);
  try {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputFilePath, content);
    console.log(chalk.green(`Converted: ${outputFilePath}`));
  } catch (error: any) {
    console.error(
      chalk.red(`Error writing file ${outputFilePath}: ${error.message}`)
    );
    throw error;
  }
}

/**
 * Reads the contents of a directory.
 *
 * @param {string} dirPath - The path to the directory to be read.
 * @return {Promise<string[]>} A promise that resolves to an array of file names in the directory.
 * @throws {Error} If there is an error reading the directory.
 */
export async function readDirectory(dirPath: string): Promise<string[]> {
  try {
    return await fs.readdir(dirPath);
  } catch (error: any) {
    console.error(
      chalk.red(`Error reading directory ${dirPath}: ${error.message}`)
    );
    throw error;
  }
}
