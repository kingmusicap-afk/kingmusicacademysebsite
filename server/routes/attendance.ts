import express from "express";
import { getDb } from "../db.js";
import { attendance, enrollments } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Record attendance for a student
router.post("/:enrollmentId", async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { attendanceDate, attended, notes } = req.body;
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    const result = await db.insert(attendance).values({
      enrollmentId: parseInt(enrollmentId),
      attendanceDate: new Date(attendanceDate),
      attended: attended ? 1 : 0,
      notes: notes || null,
    });

    res.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ error: "Failed to record attendance" });
  }
});

// Get attendance records for a student
router.get("/student/:enrollmentId", async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    const records = await db
      .select()
      .from(attendance)
      .where(eq(attendance.enrollmentId, parseInt(enrollmentId)));

    res.json(records);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// Get attendance report for all students
router.get("/report/all", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    const records = await db
      .select({
        id: attendance.id,
        enrollmentId: attendance.enrollmentId,
        firstName: enrollments.firstName,
        lastName: enrollments.lastName,
        specificCourse: enrollments.specificCourse,
        location: enrollments.location,
        attendanceDate: attendance.attendanceDate,
        attended: attendance.attended,
        notes: attendance.notes,
      })
      .from(attendance)
      .innerJoin(enrollments, eq(attendance.enrollmentId, enrollments.id));

    // Generate CSV format
    const csv = [
      ["Student Name", "Course", "Location", "Attendance Date", "Status", "Notes"],
      ...records.map((r: any) => [
        `${r.firstName} ${r.lastName}`,
        r.specificCourse,
        r.location,
        new Date(r.attendanceDate).toLocaleDateString(),
        r.attended ? "Present" : "Absent",
        r.notes || "",
      ]),
    ]
      .map((row: any) => row.map((cell: any) => `"${cell}"`).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance_report.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// Update attendance record
router.patch("/:attendanceId", async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { attended, notes } = req.body;
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    await db
      .update(attendance)
      .set({
        attended: attended ? 1 : 0,
        notes: notes || null,
      })
      .where(eq(attendance.id, parseInt(attendanceId)));

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

export default router;
