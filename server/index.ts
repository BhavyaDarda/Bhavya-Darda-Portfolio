
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register API routes and additional routes.
  const server = await registerRoutes(app);

  // Error handler middleware.
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development; serve static files in production.
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // When running in non-serverless environments, start the server locally.
  // When deploying on platforms like Vercel, do not call listen()—just export the app.
  if (!process.env.VERCEL) {
    // Use environment variables or sensible defaults.
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
    const host = process.env.HOST || "127.0.0.1";
    // Build listen options. Conditionally include reusePort if supported.
    const listenOptions: { port: number; host: string; reusePort?: boolean } = { port, host };
    if (process.platform !== "win32") {
      listenOptions.reusePort = true;
    }
    server.listen(listenOptions, () => {
      log(`serving on ${host}:${port}`);
    });
  }
})();

// Export the Express app for serverless environments (like Vercel).
export default app;
