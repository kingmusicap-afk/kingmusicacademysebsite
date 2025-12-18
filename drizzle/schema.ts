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
  age: int("age"),
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

// Attendance tracking table
export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  attendanceDate: timestamp("attendanceDate").notNull(),
  attended: int("attended").default(0).notNull(), // 1 for present, 0 for absent
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;

// Class capacity limits table
export const classCapacity = mysqlTable("classCapacity", {
  id: int("id").autoincrement().primaryKey(),
  day: varchar("day", { length: 20 }).notNull(), // Monday, Tuesday, Wednesday, Thursday, Friday
  time: varchar("time", { length: 10 }).notNull(), // 2:00 PM, 3:00 PM, etc.
  location: varchar("location", { length: 100 }).notNull(), // Goodlands, Flacq, Quatre Bornes
  courseType: varchar("courseType", { length: 100 }).notNull(), // Instruments, Media, Audio, etc.
  maxCapacity: int("maxCapacity").notNull().default(10), // Maximum students allowed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClassCapacity = typeof classCapacity.$inferSelect;
export type InsertClassCapacity = typeof classCapacity.$inferInsert;
// Class reminders table for tracking sent reminders
export const classReminders = mysqlTable("classReminders", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  reminderDate: timestamp("reminderDate").notNull(),
  classDate: timestamp("classDate").notNull(),
  emailSent: int("emailSent").default(0).notNull(),
  whatsappSent: int("whatsappSent").default(0).notNull(),
  emailSentAt: timestamp("emailSentAt"),
  whatsappSentAt: timestamp("whatsappSentAt"),
  emailError: text("emailError"),
  whatsappError: text("whatsappError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassReminder = typeof classReminders.$inferSelect;
export type InsertClassReminder = typeof classReminders.$inferInsert;
