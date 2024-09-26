import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

import { getFilesByExtension } from "./utils.js";
import { readFile, writeFile } from "../utils.js";

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

export async function convertMarkdownToHTML(
  inputFilePath: string,
  outputFilePath: string,
  template: string,
  cssFiles: string[] = []
) {
  try {
    const markdown = await readFile(inputFilePath);
    const htmlContent = marked(markdown);
    const websocketScript = await readFile("src/template/websocket.ts");
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

    const fullHtml = template
      .replace("{{content}}", htmlContent as string)
      .replace("{{title}}", path.basename(outputFilePath, ".html"))
      .replace("{{script}}", websocketScript)
      .replace("</head>", `${cssLinks}\n</head>`);

    await writeFile(outputFilePath, fullHtml);
  } catch (error) {
    console.error(`Failed to convert ${inputFilePath}: ${error}`);
  }
}

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
