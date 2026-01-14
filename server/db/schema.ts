import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enrollments table to store student enrollment data
export const enrollments = pgTable("enrollments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 20 }).notNull(),
  age: integer(), // Student age
  location: varchar({ length: 100 }).notNull(), // Goodlands, Flacq, or Quatre Bornes
  courseType: varchar({ length: 100 }).notNull(), // Instruments, Media, Audio, Songwriting, Worship
  courseLevel: varchar({ length: 50 }).notNull(), // Beginner or Intermediate
  specificCourse: varchar({ length: 100 }).notNull(), // e.g., "Drums", "Guitar", "Vocal", etc.
  parentName: varchar({ length: 100 }), // For minor students
  parentPhone: varchar({ length: 20 }), // For minor students
  previousExperience: text(), // Any previous music experience
  startDate: varchar({ length: 50 }).notNull(), // Preferred start date
  classDay: varchar({ length: 20 }), // e.g., Monday, Tuesday, Wednesday, etc.
  classTime: varchar({ length: 20 }), // e.g., 9am, 2pm, 5pm, etc.
  enrollmentDate: timestamp().notNull().defaultNow(),
  status: varchar({ length: 50 }).notNull().default("pending"), // pending, confirmed, cancelled
  notes: text(), // Additional notes from student
});

// Zod schemas for validation
export const insertEnrollmentSchema = createInsertSchema(enrollments).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  location: true,
  courseType: true,
  courseLevel: true,
  specificCourse: true,
  parentName: true,
  parentPhone: true,
  previousExperience: true,
  startDate: true,
  notes: true,
});

export const selectEnrollmentSchema = createSelectSchema(enrollments);

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
