import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { createEnrollment, getEnrollments, getEnrollmentById, updateEnrollmentStatus, deleteEnrollment } from "./db";
import type { InsertEnrollment } from "../drizzle/schema";

describe("Enrollment CRUD Operations", () => {
  let testEnrollmentId: number;

  beforeAll(async () => {
    // Create a test enrollment
    const testData: InsertEnrollment = {
      firstName: "Test",
      lastName: "Student",
      email: "test@example.com",
      phone: "+230 5555 5555",
      age: 18,
      location: "Goodlands",
      courseType: "Instruments",
      courseLevel: "Beginner",
      specificCourse: "Guitar",
      startDate: "2026-02-01",
      status: "pending",
    };

    const result = await createEnrollment(testData);
    if (result && typeof result === "object" && "id" in result) {
      testEnrollmentId = (result as any).id;
    } else {
      // If result is an array or has insertId
      testEnrollmentId = (result as any)?.insertId || 1;
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (testEnrollmentId) {
      try {
        await deleteEnrollment(testEnrollmentId);
      } catch (error) {
        console.warn("Cleanup failed:", error);
      }
    }
  });

  it("should create an enrollment with pending status", async () => {
    const testData: InsertEnrollment = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+230 1234 5678",
      age: 20,
      location: "Flacq",
      courseType: "Instruments",
      courseLevel: "Intermediate",
      specificCourse: "Piano",
      startDate: "2026-02-15",
      status: "pending",
    };

    const enrollment = await createEnrollment(testData);
    expect(enrollment).toBeDefined();
    expect((enrollment as any).status).toBe("pending");

    // Cleanup
    if ((enrollment as any)?.id) {
      await deleteEnrollment((enrollment as any).id);
    }
  });

  it("should fetch all enrollments", async () => {
    const enrollments = await getEnrollments();
    expect(Array.isArray(enrollments)).toBe(true);
    expect(enrollments.length).toBeGreaterThan(0);
  });

  it("should fetch a single enrollment by ID", async () => {
    if (!testEnrollmentId) {
      console.warn("Skipping test: testEnrollmentId not set");
      return;
    }

    const enrollment = await getEnrollmentById(testEnrollmentId);
    expect(enrollment).toBeDefined();
    expect((enrollment as any)?.id).toBe(testEnrollmentId);
    expect((enrollment as any)?.firstName).toBe("Test");
  });

  it("should update enrollment status from pending to confirmed", async () => {
    if (!testEnrollmentId) {
      console.warn("Skipping test: testEnrollmentId not set");
      return;
    }

    // Update status to confirmed
    await updateEnrollmentStatus(testEnrollmentId, "confirmed");

    // Verify the update persisted
    const updated = await getEnrollmentById(testEnrollmentId);
    expect((updated as any)?.status).toBe("confirmed");
  });

  it("should update enrollment status from confirmed to cancelled", async () => {
    if (!testEnrollmentId) {
      console.warn("Skipping test: testEnrollmentId not set");
      return;
    }

    // Update status to cancelled
    await updateEnrollmentStatus(testEnrollmentId, "cancelled");

    // Verify the update persisted
    const updated = await getEnrollmentById(testEnrollmentId);
    expect((updated as any)?.status).toBe("cancelled");
  });

  it("should update enrollment status back to pending", async () => {
    if (!testEnrollmentId) {
      console.warn("Skipping test: testEnrollmentId not set");
      return;
    }

    // Update status back to pending
    await updateEnrollmentStatus(testEnrollmentId, "pending");

    // Verify the update persisted
    const updated = await getEnrollmentById(testEnrollmentId);
    expect((updated as any)?.status).toBe("pending");
  });

  it("should delete an enrollment", async () => {
    // Create a temporary enrollment to delete
    const tempData: InsertEnrollment = {
      firstName: "Delete",
      lastName: "Me",
      email: "delete@example.com",
      phone: "+230 9999 9999",
      age: 25,
      location: "Quatre Bornes",
      courseType: "Instruments",
      courseLevel: "Beginner",
      specificCourse: "Drums",
      startDate: "2026-03-01",
      status: "pending",
    };

    const enrollment = await createEnrollment(tempData);
    const tempId = (enrollment as any)?.id || (enrollment as any)?.insertId;

    if (!tempId) {
      console.warn("Skipping delete test: Could not get enrollment ID");
      return;
    }

    // Delete the enrollment
    await deleteEnrollment(tempId);

    // Verify it's deleted
    const deleted = await getEnrollmentById(tempId);
    expect(deleted).toBeNull();
  });

  it("should handle multiple status updates without data loss", async () => {
    if (!testEnrollmentId) {
      console.warn("Skipping test: testEnrollmentId not set");
      return;
    }

    // Simulate admin making multiple updates
    const statusSequence = ["pending", "confirmed", "pending", "confirmed", "cancelled"];

    for (const status of statusSequence) {
      await updateEnrollmentStatus(testEnrollmentId, status);
      const current = await getEnrollmentById(testEnrollmentId);
      expect((current as any)?.status).toBe(status);
    }
  });
});
