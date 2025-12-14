import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Enrollments table to store student enrollment data
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(), // Goodlands, Flacq, or Quatre Bornes
  courseType: varchar("courseType", { length: 100 }).notNull(), // Instruments, Media, Audio, Songwriting, Worship
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(), // Beginner or Intermediate
  specificCourse: varchar("specificCourse", { length: 100 }).notNull(), // e.g., "Drums", "Guitar", "Vocal", etc.
  parentName: varchar("parentName", { length: 100 }),
  parentPhone: varchar("parentPhone", { length: 20 }),
  previousExperience: text("previousExperience"),
  startDate: varchar("startDate", { length: 50 }).notNull(),
  enrollmentDate: timestamp("enrollmentDate").defaultNow().notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, confirmed, cancelled
  notes: text("notes"),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;