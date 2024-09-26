import open from "open";
import chalk from "chalk";
import * as path from "path";
import { WebSocketServer } from "ws";
import { createServer, IncomingMessage, ServerResponse } from "http";

import { serveFile, generateDirectoryListing, fullHTML } from "./utils.js";

/**
 * Starts an HTTP server and a WebSocket server for live reloading.
 * Serves HTML files from the output directory and establishes a WebSocket connection for live updates.
 * @param outputDir - The directory where the HTML files are located.
 * @param port - The port number to run the server on (default is 8080).
 * @returns The WebSocketServer instance.
 */
export const startLiveServer = (
  outputDir: string,
  port: number = 8080
): WebSocketServer => {
  console.log(chalk.green(`Initializing Live Server on port ${port}...`));

  // Create the HTTP server to serve HTML and other files.
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      const reqPath = req.url || "/";

      // Serve directory listing when root is requested.
      if (reqPath === "/") {
        let listing = generateDirectoryListing(outputDir);
        listing = fullHTML.replace("{{listing}}", listing);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(listing);
        return;
      }

      // Serve CSS files if requested.
      let filePath = path.join(outputDir, path.basename(reqPath));
      if (reqPath.endsWith(".css")) {
        serveFile(res, filePath, "text/css", "/* CSS file not found */");
        return;
      }

      // Serve HTML files.
      filePath = path.join(outputDir, reqPath);
      if (reqPath.endsWith(".html")) {
        serveFile(res, filePath, "text/html", "<h1>404 Not Found</h1>");
      }
    } catch (err: any) {
      console.error(chalk.red(`Server error: ${err.message}`));
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>500 Internal Server Error</h1>");
    }
  });

  // Start the HTTP server.
  server.listen(port, "localhost", () => {
    console.log(chalk.green(`Server is running at http://localhost:${port}`));
    open(`http://localhost:${port}`);
  });

  // Initialize the WebSocketServer for live reloading.
  const wss = new WebSocketServer({ server });

  // Notify clients when a new connection is made.
  wss.on("connection", (ws) => {
    ws.send("Connected to Live Server");
  });

  return wss;
};
