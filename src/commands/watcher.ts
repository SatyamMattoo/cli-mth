import chalk from "chalk";
import * as path from "path";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";

import { startLiveServer } from "./liveServer.js";
import { convertMarkdownToHTML } from "./convert.js";
import { defaultHTML } from "./template/default.js";

/*************  ✨ Codeium AI Suggestion  *************/
/**
 * Watches for changes in the specified input directory and converts changed Markdown files to HTML.
 *
 * @param {string} inputDir - The directory to watch for changes.
 * @param {string} outputDir - The directory where the converted HTML files will be saved.
 * @param {boolean} live - Whether to start a live server for real-time viewing.
 * @param {number} [port] - The port number for the live server. Default is 8080.
 * @param {string[]} [css] - An optional array of CSS files to include in the generated HTML.
 * @param {string} [template=defaultHTML] - The HTML template to use for generating the HTML files. Default is the default HTML template.
 * @return {Promise<void>} A promise that resolves when the function completes.
 */
/****  bot-99970ee3-8fc8-4ecb-b12b-f65bc53b2118  *****/
export async function watchFiles(
  inputDir: string,
  outputDir: string,
  live: boolean,
  port?: number,
  css?: string[],
  template = defaultHTML
): Promise<void> {
  console.log(chalk.blue(`Watching for changes in: ${inputDir}`));

  const watcher = chokidar.watch(`${inputDir}`, {
    ignored: (path: string, stats?: any) =>
      stats?.isFile() && !path.endsWith(".md"),
    persistent: true,
  });

  let wss: WebSocketServer;
  if (live) {
    wss = await startLiveServer(outputDir, port);
  }

  watcher.on("change", (filePath: string) => {
    console.log(chalk.blue(`Detected change in: ${filePath}`));
    const fileName = path.basename(filePath, ".md") + ".html";
    const outputFilePath = path.join(process.cwd(), outputDir, fileName);

    // Convert the changed Markdown file to HTML
    convertMarkdownToHTML(filePath, outputFilePath, template, css);

    // Notify all clients about the change
    if (wss) {
      console.log(chalk.blue(`Notifying clients about changes in ${fileName}`));
      wss.clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`File updated: ${fileName}`);
        }
      });
    }
  });
}
