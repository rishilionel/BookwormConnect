import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage, DatabaseStorage } from "./storage";
import { sql } from "drizzle-orm";
import { db } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
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
  try {
    // Initialize database if using DatabaseStorage
    if (storage instanceof DatabaseStorage) {
      log("Initializing database...");
      await db.execute(sql`CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`);
      
      // Push schema changes
      log("Running database migrations...");
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          image_url TEXT
        );
        
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          price VARCHAR(50) NOT NULL,
          compare_at_price VARCHAR(50),
          image_url TEXT,
          category_id INTEGER NOT NULL REFERENCES categories(id),
          stock INTEGER NOT NULL DEFAULT 0,
          is_featured BOOLEAN DEFAULT FALSE,
          is_trending BOOLEAN DEFAULT FALSE,
          badge VARCHAR(50),
          rating VARCHAR(10),
          review_count INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          product_id INTEGER NOT NULL REFERENCES products(id),
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      
      // Seed initial data
      log("Seeding initial data...");
      await (storage as DatabaseStorage).seedInitialData();
      log("Database initialization complete");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
