import path from "path";
import * as fs from "fs";
import chalk from "chalk";
import { ServerResponse } from "http";

/**
 * Recursively get all files with a given extension in a directory.
 * @param dir - The directory to search for files.
 * @param extension - The file extension to filter by (e.g., '.md', '.css').
 * @returns A promise that resolves to an array of file paths with the given extension.
 */
export async function getFilesByExtension(
  dir: string,
  extension: string
): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recursively get files in the subdirectory
      const subFiles = await getFilesByExtension(fullPath, extension);
      files.push(...subFiles);
    } else if (entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Helper function to serve files from the output directory.
 * @param res - The ServerResponse object.
 * @param filePath - The path to the file to serve.
 * @param contentType - The MIME type of the file.
 * @param notFoundMessage - Message to display when the file is not found.
 */
export function serveFile(
  res: ServerResponse,
  filePath: string,
  contentType: string,
  notFoundMessage: string
): void {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(chalk.red(`Error reading file: ${filePath}`));
      res.writeHead(404, { "Content-Type": contentType });
      res.end(notFoundMessage);
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

/**
 * Recursively generates a directory listing for the specified output directory.
 * Includes files in subdirectories and generates relative links.
 * @param dirPath - The directory to list files for.
 * @param baseDir - The base directory relative to the HTTP server.
 * @returns HTML content representing the directory structure.
 */
export const generateDirectoryListing = (
  dirPath: string,
  baseDir: string = ""
): string => {
  let listing = "<ul>";

  try {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      const relativePath = path.join(baseDir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively generate directory listing for subdirectories
        listing += `<li><strong>${file}/</strong>`;
        listing += generateDirectoryListing(fullPath, relativePath);
        listing += "</li>";
      } else if (file.endsWith(".html")) {
        listing += `<li><a href="${relativePath}">${file}</a></li>`;
      }
    });
  } catch (err: any) {
    console.error(
      chalk.red(`Error generating directory listing: ${err.message}`)
    );
    throw new Error("Failed to generate directory listing");
  }

  listing += "</ul>";

  // Only include the heading at the top level
  return `
    <div>
      ${listing}
    </div>
  `;
};

/**
 * Copy files with a given extension from the input directory to the output directory.
 * Maintains the same directory structure.
 * @param inputDir - The source directory to copy files from.
 * @param outputDir - The destination directory to copy files to.
 * @param extension - The file extension to filter by (e.g., '.css').
 */
export async function copyFilesByExtension(
  inputDir: string,
  outputDir: string,
  extension: string
) {
  const files = await getFilesByExtension(inputDir, extension);

  for (const file of files) {
    const relativePath = path.relative(inputDir, file);
    const outputFilePath = path.join(outputDir, relativePath);

    // Ensure the output directory exists
    await fs.promises.mkdir(path.dirname(outputFilePath), { recursive: true });

    // Copy the file to the output directory
    await fs.promises.copyFile(file, outputFilePath);
  }
}
