import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import enrollmentsRouter from "../routes/enrollments.js";
import remindersRouter from "../routes/reminders.js";
import { getDb } from "../db.js";
import { enrollments } from "../../drizzle/schema.js";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Debug endpoint
  app.get("/api/debug/db", async (req, res) => {
    try {
      const dbUrl = process.env.DATABASE_URL || "NOT SET";
      const masked = dbUrl ? dbUrl.replace(/:[^@]*@/, ":***@") : "NOT SET";
      const db = await getDb();
      let enrollmentCount = 0;
      let queryError = null;
      if (db) {
        try {
          const result = await db.select().from(enrollments);
          enrollmentCount = result.length;
        } catch (e: any) {
          queryError = e.message;
        }
      }
      res.json({
        database_url: masked,
        node_env: process.env.NODE_ENV,
        db_connected: db !== null,
        enrollment_count: enrollmentCount,
        query_error: queryError
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Enrollments API
  app.use("/api/enrollments", enrollmentsRouter);
  // Reminders API
  app.use("/api/reminders", remindersRouter);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
