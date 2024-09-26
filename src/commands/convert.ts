import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

import { getFilesByExtension } from "./utils.js";
import { readFile, writeFile } from "../utils.js";
import { defaultHTML } from "./template/default.js";

/**
 * Copy CSS files from the input directory to the output directory.
 * Maintains the same directory structure.
 * @param inputDir - The source directory to copy files from.
 * @param outputDir - The destination directory to copy files to.
 */
export async function copyCssFiles(inputDir: string, outputDir: string) {
  const cssFiles = await getFilesByExtension(inputDir, ".css");
  const normalizedOutputDir = path.resolve(path.normalize(outputDir));

  for (const cssFile of cssFiles) {
    const normalizedCssFile = path.resolve(path.normalize(cssFile));

    // Ensure that we are not copying CSS files from the output directory
    if (!normalizedCssFile.startsWith(normalizedOutputDir)) {
      const relativePath = path.relative(inputDir, cssFile);
      const outputFilePath = path.join(normalizedOutputDir, relativePath);

      // Ensure the output directory exists
      await fs.promises.mkdir(path.dirname(outputFilePath), {
        recursive: true,
      });

      // Copy the CSS file to the output directory
      await fs.promises.copyFile(cssFile, outputFilePath);
    }
  }
}

/**
 * Converts a Markdown file to HTML and saves the result to a specified output file.
 *
 * @param {string} inputFilePath - The path to the Markdown file to convert.
 * @param {string} outputFilePath - The path to the output HTML file.
 * @param {string} template - The path to the HTML template file.
 * @param {string[]} [cssFiles=[]] - An array of CSS file paths to include in the output HTML.
 * @return {Promise<void>} - A promise that resolves when the conversion is complete.
 * @throws {Error} - If there is an error reading the Markdown file, the HTML template file, or writing the output file.
 */
export async function convertMarkdownToHTML(
  inputFilePath: string,
  outputFilePath: string,
  template: string,
  cssFiles: string[] = []
): Promise<void> {
  try {
    const markdown = await readFile(inputFilePath);
    const htmlContent = marked(markdown);
    const websocketScript = await readFile("src/commands/template/websocket.ts");
    let cssLinks = cssFiles
      .filter((cssFile) => {
        return path.dirname(inputFilePath) === path.dirname(cssFile);
      })
      .map(
        (cssFile) =>
          `<link rel="stylesheet" type="text/css" href="${path.dirname(
            inputFilePath
          )}/${cssFile}">`
      )
      .join("\n");

    const fullHtml = defaultHTML
      .replace("{{content}}", htmlContent as string)
      .replace("{{title}}", path.basename(outputFilePath, ".html"))
      .replace("{{script}}", websocketScript)
      .replace("</head>", `${cssLinks}\n</head>`);

    await writeFile(outputFilePath, fullHtml);
  } catch (error) {
    console.error(`Failed to convert ${inputFilePath}: ${error}`);
  }
}

/**
 * Processes Markdown files and converts them to HTML.
 *
 * @param {string} inputDir - The directory containing Markdown files or a single Markdown file.
 * @param {string} outputDir - The directory where the converted HTML files will be saved.
 * @param {string} template - The path to a custom HTML template.
 * @param {boolean} single - Indicates whether to convert a single Markdown file.
 * @param {string[]} [css] - An array of CSS file paths to include in the output HTML.
 * @return {Promise<void>} - A promise that resolves when the processing is complete.
 */
export async function processFiles(
  inputDir: string,
  outputDir: string,
  template: string,
  single: boolean,
  css?: string[]
) {
  const currentDir = process.cwd();

  if (single) {
    const outputFilePath = path.join(
      currentDir,
      outputDir,
      path.basename(inputDir).replace(".md", ".html")
    );
    await convertMarkdownToHTML(inputDir, outputFilePath, template, css);

    await copyCssFiles(path.dirname(inputDir), outputDir);
  } else {
    // Get all Markdown files from the input directory and its subdirectories
    const markdownFiles = await getFilesByExtension(inputDir, ".md");
    for (const inputFilePath of markdownFiles) {
      const relativePath = path.relative(inputDir, inputFilePath);
      const outputFilePath = path.join(
        currentDir,
        outputDir,
        relativePath.replace(".md", ".html")
      );

      // Create the output directory if it doesn't exist
      await fs.promises.mkdir(path.dirname(outputFilePath), {
        recursive: true,
      });

      await convertMarkdownToHTML(inputFilePath, outputFilePath, template, css);
    }
    // Process and copy all CSS files to the output directory
    await copyCssFiles(inputDir, outputDir);
  }
}
