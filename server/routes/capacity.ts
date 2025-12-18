import express from "express";
import { getDb } from "../db.js";
import { classCapacity, enrollments } from "../../drizzle/schema.js";
import { eq, and } from "drizzle-orm";

const router = express.Router();

// Get class capacity for a specific slot
router.get("/:day/:time/:location", async (req, res) => {
  try {
    const { day, time, location } = req.params;
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    const capacity = await db
      .select()
      .from(classCapacity)
      .where(
        and(
          eq(classCapacity.day, day),
          eq(classCapacity.time, time),
          eq(classCapacity.location, location)
        )
      )
      .limit(1);

    if (capacity.length === 0) {
      res.json({ maxCapacity: 10, currentEnrollment: 0, isFull: false });
      return;
    }

    // Count current enrollments for this slot
    const enrollmentCount = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.location, location));

    res.json({
      ...capacity[0],
      currentEnrollment: enrollmentCount.length,
      isFull: enrollmentCount.length >= capacity[0].maxCapacity,
    });
  } catch (error) {
    console.error("Error fetching class capacity:", error);
    res.status(500).json({ error: "Failed to fetch capacity" });
  }
});

// Set class capacity limit
router.post("/", async (req, res) => {
  try {
    const { day, time, location, courseType, maxCapacity } = req.body;
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    // Check if capacity record exists
    const existing = await db
      .select()
      .from(classCapacity)
      .where(
        and(
          eq(classCapacity.day, day),
          eq(classCapacity.time, time),
          eq(classCapacity.location, location)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db
        .update(classCapacity)
        .set({ maxCapacity })
        .where(eq(classCapacity.id, existing[0].id));
    } else {
      // Create new
      await db.insert(classCapacity).values({
        day,
        time,
        location,
        courseType,
        maxCapacity,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error setting class capacity:", error);
    res.status(500).json({ error: "Failed to set capacity" });
  }
});

// Get all class capacities
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    const capacities = await db.select().from(classCapacity);
    res.json(capacities);
  } catch (error) {
    console.error("Error fetching class capacities:", error);
    res.status(500).json({ error: "Failed to fetch capacities" });
  }
});

export default router;
