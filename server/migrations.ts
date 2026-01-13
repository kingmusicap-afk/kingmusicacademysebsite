import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  try {
    console.log("[Migrations] Starting migration runner...");
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.warn("[Migrations] DATABASE_URL not set, skipping migrations");
      return;
    }

    console.log("[Migrations] Running drizzle migrations...");
    
    // Run drizzle migrations
    const result = execSync("npx drizzle-kit migrate --config drizzle.config.ts", {
      cwd: path.join(__dirname, ".."),
      encoding: "utf-8",
      stdio: "pipe"
    });
    
    console.log("[Migrations] Migration output:", result);
    console.log("[Migrations] ✓ Migrations completed successfully");
  } catch (error) {
    console.error("[Migrations] Error running migrations:", error);
    console.error("[Migrations] Error message:", (error as any)?.message);
    // Don't throw - let the app continue even if migrations fail
    // This allows the app to start and show error logs
  }
}
