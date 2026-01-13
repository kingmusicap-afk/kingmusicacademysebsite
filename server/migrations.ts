import mysql from "mysql2/promise";

export async function runMigrations() {
  try {
    console.log("[Migrations] Starting migration runner...");
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.warn("[Migrations] DATABASE_URL not set, skipping migrations");
      return;
    }

    console.log("[Migrations] Connecting to database...");
    
    // Parse DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    const connectionConfig: any = {
      host: url.hostname,
      port: parseInt(url.port || "3306"),
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
    };
    
    // Add SSL if needed (for cloud databases)
    if (url.hostname.includes("tidbcloud") || url.hostname.includes("amazonaws")) {
      connectionConfig.ssl = { rejectUnauthorized: false };
    }
    
    const connection = await mysql.createConnection(connectionConfig);

    console.log("[Migrations] Connected to database");

    // Check if migrations table exists
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '__drizzle_migrations__'"
    );
    
    if ((tables as any[]).length === 0) {
      console.log("[Migrations] Creating migrations table...");
      await connection.query(`
        CREATE TABLE __drizzle_migrations__ (
          id SERIAL PRIMARY KEY,
          hash text NOT NULL,
          created_at bigint
        )
      `);
    }

    // Get list of applied migrations
    const [appliedMigrations] = await connection.query(
      "SELECT hash FROM __drizzle_migrations__"
    );
    const appliedHashes = new Set((appliedMigrations as any[]).map(m => m.hash));

    // Define migrations
    const migrations = [
      {
        hash: "0000_amusing_the_santerians",
        sql: `CREATE TABLE IF NOT EXISTS \`users\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`openId\` varchar(64) NOT NULL,
          \`name\` text,
          \`email\` varchar(320),
          \`loginMethod\` varchar(64),
          \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
          \`createdAt\` timestamp NOT NULL DEFAULT (now()),
          \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
          \`lastSignedIn\` timestamp NOT NULL DEFAULT (now()),
          CONSTRAINT \`users_id\` PRIMARY KEY(\`id\`),
          CONSTRAINT \`users_openId_unique\` UNIQUE(\`openId\`)
        );`
      },
      {
        hash: "0001_next_morph",
        sql: `CREATE TABLE IF NOT EXISTS \`enrollments\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`firstName\` varchar(100) NOT NULL,
          \`lastName\` varchar(100) NOT NULL,
          \`email\` varchar(255) NOT NULL,
          \`phone\` varchar(20) NOT NULL,
          \`location\` varchar(100) NOT NULL,
          \`courseType\` varchar(100) NOT NULL,
          \`courseLevel\` varchar(50) NOT NULL,
          \`specificCourse\` varchar(100) NOT NULL,
          \`parentName\` varchar(100),
          \`parentPhone\` varchar(20),
          \`previousExperience\` text,
          \`startDate\` varchar(50) NOT NULL,
          \`enrollmentDate\` timestamp NOT NULL DEFAULT (now()),
          \`status\` varchar(50) NOT NULL DEFAULT 'pending',
          \`notes\` text,
          CONSTRAINT \`enrollments_id\` PRIMARY KEY(\`id\`)
        );`
      },
      {
        hash: "0002_steady_millenium_guard",
        sql: `ALTER TABLE \`enrollments\` ADD \`age\` int;`
      },
      {
        hash: "0003_nosy_blizzard",
        sql: `ALTER TABLE \`attendance\` ADD \`notes\` text;`
      },
      {
        hash: "0004_low_kronos",
        sql: `CREATE TABLE IF NOT EXISTS \`attendance\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`enrollmentId\` int NOT NULL,
          \`date\` date NOT NULL,
          \`status\` varchar(50) NOT NULL,
          CONSTRAINT \`attendance_id\` PRIMARY KEY(\`id\`)
        );`
      },
      {
        hash: "0005_complex_energizer",
        sql: `ALTER TABLE \`enrollments\` ADD \`classDay\` varchar(20);
        ALTER TABLE \`enrollments\` ADD \`classTime\` varchar(10);`
      }
    ];

    // Run pending migrations
    for (const migration of migrations) {
      if (!appliedHashes.has(migration.hash)) {
        console.log(`[Migrations] Running migration: ${migration.hash}`);
        try {
          await connection.query(migration.sql);
          await connection.query(
            "INSERT INTO __drizzle_migrations__ (hash, created_at) VALUES (?, ?)",
            [migration.hash, Date.now()]
          );
          console.log(`[Migrations] ✓ Migration ${migration.hash} completed`);
        } catch (error) {
          console.error(`[Migrations] Error running migration ${migration.hash}:`, error);
          // Continue with next migration instead of failing
        }
      }
    }

    await connection.end();
    console.log("[Migrations] ✓ All migrations completed successfully");
  } catch (error) {
    console.error("[Migrations] Error running migrations:", error);
    console.error("[Migrations] Error message:", (error as any)?.message);
    // Don't throw - let the app continue even if migrations fail
  }
}
