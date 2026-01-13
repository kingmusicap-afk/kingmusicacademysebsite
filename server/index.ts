import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import enrollmentsRouter from "./routes/enrollments.js";
import contactRouter from "./routes/contact.js";
import attendanceRouter from "./routes/attendance.js";
import capacityRouter from "./routes/capacity.js";
import remindersRouter from "./routes/reminders.js";
import { runMigrations } from "./migrations.js";
import { getDb } from "./db.js";
import { enrollments } from "../drizzle/schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Run migrations before starting the server
  await runMigrations();
  
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Debug endpoint to check database status
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
        port: process.env.PORT || 3000,
        db_connected: db !== null,
        enrollment_count: enrollmentCount,
        query_error: queryError
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message
      });
    }
  });

  // API Routes
  app.use("/api/enrollments", enrollmentsRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/attendance", attendanceRouter);
  app.use("/api/capacity", capacityRouter);
  app.use("/api/reminders", remindersRouter);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes (must be last)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
