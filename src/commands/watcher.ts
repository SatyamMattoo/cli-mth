import chalk from "chalk";
import * as path from "path";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";

import { startLiveServer } from "./liveServer.js";
import { convertMarkdownToHTML } from "./convert.js";

export async function watchFiles(
  inputDir: string,
  outputDir: string,
  live: boolean,
  port?: number,
  css?: string[],
  template = "<html><body>{{content}}</body></html>"
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
