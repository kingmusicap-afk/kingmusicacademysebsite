import { Router } from "express";
import { createEnrollment, getEnrollments, getEnrollmentById, updateEnrollmentStatus, deleteEnrollment } from "../db.js";
import { ENV } from "../_core/env.js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const router = Router();

// Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kingmusicltd@gmail.com",
    pass: ENV.gmailPassword,
  },
});

// Verify Gmail connection on startup
console.log("[Gmail SMTP] Initializing...");
if (!ENV.gmailPassword) {
  console.warn("⚠️  WARNING: GMAIL_PASSWORD is not set. Email notifications will not be sent.");
} else {
  transporter.verify((error, success) => {
    if (error) {
      console.error("[Gmail SMTP] Verification failed:", error.message);
    } else {
      console.log("✓ Gmail SMTP initialized and verified");
    }
  });
}

// POST /api/enrollments - Create a new enrollment
router.post("/", async (req, res) => {
  try {
    console.log("[ENROLLMENT] POST request received");
    console.log("[ENROLLMENT] Request body:", JSON.stringify(req.body, null, 2));
    fs.writeFileSync('/tmp/enrollment-request.json', JSON.stringify({ body: req.body, timestamp: new Date() }, null, 2));
    
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      location,
      courseType,
      courseLevel,
      specificCourse,
      parentName,
      parentPhone,
      previousExperience,
      startDate,
      classDay,
      classTime,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !location ||
      !courseType ||
      !courseLevel ||
      !specificCourse ||
      !startDate
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Create enrollment in database
    const enrollment = await createEnrollment({
      firstName,
      lastName,
      email,
      phone,
      age: age ? parseInt(age) : undefined,
      location,
      courseType,
      courseLevel,
      specificCourse,
      parentName: parentName || undefined,
      parentPhone: parentPhone || undefined,
      previousExperience: previousExperience || undefined,
      startDate,
      classDay: classDay || undefined,
      classTime: classTime || undefined,
      status: "pending",
      notes: notes || undefined,
    });

    // Send confirmation email to student
    const studentEmailHtml = `
      <h2>Welcome to King Music Academy!</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for enrolling in our ${specificCourse} course (${courseLevel} level).</p>
      <p><strong>Enrollment Details:</strong></p>
      <ul>
        <li>Course: ${specificCourse}</li>
        <li>Level: ${courseLevel}</li>
        <li>Location: ${location}</li>
        <li>Preferred Start Date: ${startDate}</li>
        <li>Course Type: ${courseType}</li>
      </ul>
      <p><strong>Payment Required:</strong></p>
      <ul>
        <li><strong>Monthly Subscription:</strong> Rs 1,200/month</li>
        <li><strong>First Payment:</strong> Rs 1,200 (non-refundable deposit to secure your enrollment)</li>
        <li><strong>Following Months:</strong> Rs 1,200/month (months 2-12)</li>
        <li>Payment Method: Juice by MCB (57566278)</li>
        <li>Please include your full name in the payment message</li>
        <li><strong style="color: red;">The first payment is NON-REFUNDABLE and acts as a security deposit</strong></li>
      </ul>
      <p>Please complete your payment within 24 hours to secure your enrollment.</p>
      <p>We will contact you shortly to confirm your payment and discuss course details.</p>
      <p>For any questions, please reply to this email or contact us at kingmusicltd@gmail.com</p>
      <p>Best regards,<br/>King Music Academy Team</p>
    `;

    try {
      console.log(`[Email] Sending student confirmation to ${email}`);
      console.log(`[Email] From: kingmusicltd@gmail.com`);
      const studentResult = await transporter.sendMail({
        from: "kingmusicltd@gmail.com",
        to: email,
        subject: "Welcome to King Music Academy - Enrollment Confirmation",
        html: studentEmailHtml,
      });
      console.log(`✓ Student confirmation email sent to ${email}`);
      console.log(`[Email] Response:`, JSON.stringify(studentResult));
      fs.writeFileSync('/tmp/gmail-student-response.json', JSON.stringify({ success: true, response: studentResult, timestamp: new Date() }, null, 2));
    } catch (emailError) {
      console.error("Failed to send student email:", emailError);
      console.error("Error message:", (emailError as any)?.message);
      console.error("Full error:", JSON.stringify(emailError, null, 2));
      fs.writeFileSync('/tmp/gmail-student-error.json', JSON.stringify({ error: true, message: (emailError as any)?.message, timestamp: new Date() }, null, 2));
    }

    // Send notification email to academy
    const academyEmailHtml = `
      <h2>New Enrollment Received</h2>
      <p><strong>Student Information:</strong></p>
      <ul>
        <li>Name: ${firstName} ${lastName}</li>
        <li>Email: ${email}</li>
        <li>Phone: ${phone}</li>
        <li>Age: ${age || 'Not provided'}</li>
        <li>Location: ${location}</li>
      </ul>
      <p><strong>Course Details:</strong></p>
      <ul>
        <li>Course Type: ${courseType}</li>
        <li>Specific Course: ${specificCourse}</li>
        <li>Level: ${courseLevel}</li>
        <li>Preferred Start Date: ${startDate}</li>
      </ul>
      ${previousExperience ? `<p><strong>Previous Experience:</strong><br/>${previousExperience}</p>` : ""}
      ${parentName ? `<p><strong>Parent/Guardian:</strong> ${parentName} (${parentPhone})</p>` : ""}
      ${notes ? `<p><strong>Additional Notes:</strong><br/>${notes}</p>` : ""}
      <p><strong>Enrollment Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    try {
      console.log(`[Email] Sending admin notification to kingmusicltd@gmail.com`);
      const adminResult = await transporter.sendMail({
        from: "kingmusicltd@gmail.com",
        to: "kingmusicltd@gmail.com",
        subject: `New Enrollment: ${firstName} ${lastName} - ${specificCourse}`,
        html: academyEmailHtml,
      });
      console.log(`✓ Admin notification email sent`);
      console.log(`[Email] Response:`, JSON.stringify(adminResult));
      fs.writeFileSync('/tmp/gmail-admin-response.json', JSON.stringify({ success: true, response: adminResult, timestamp: new Date() }, null, 2));
    } catch (emailError) {
      console.error("Failed to send admin email:", emailError);
      console.error("Error message:", (emailError as any)?.message);
      console.error("Full error:", JSON.stringify(emailError, null, 2));
      fs.writeFileSync('/tmp/gmail-admin-error.json', JSON.stringify({ error: true, message: (emailError as any)?.message, timestamp: new Date() }, null, 2));
    }

    res.json({
      success: true,
      message: "Enrollment submitted successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    console.error("Error stack:", (error as any)?.stack);
    console.error("Error details:", JSON.stringify(error, null, 2));
    res.status(500).json({
      error: "Failed to process enrollment",
      details: (error as any)?.message || "Unknown error"
    });
  }
});

// GET /api/enrollments - Get all enrollments (admin only)
router.get("/", async (req, res) => {
  try {
    const allEnrollments = await getEnrollments();
    res.json(allEnrollments);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch enrollments",
    });
  }
});

// GET /api/enrollments/:id - Get single enrollment
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await getEnrollmentById(parseInt(id));

    if (!enrollment) {
      return res.status(404).json({
        error: "Enrollment not found",
      });
    }

    res.json(enrollment);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch enrollment",
    });
  }
});

// PUT /api/enrollments/:id - Update enrollment status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    await updateEnrollmentStatus(parseInt(id), status);

    res.json({
      success: true,
      message: "Enrollment updated",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: "Failed to update enrollment",
    });
  }
});

// PATCH /api/enrollments/:id - Update enrollment status
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be 'pending', 'confirmed', or 'cancelled'",
      });
    }

    const enrollment = await getEnrollmentById(parseInt(id));

    if (!enrollment) {
      return res.status(404).json({
        error: "Enrollment not found",
      });
    }

    await updateEnrollmentStatus(parseInt(id), status);

    res.json({
      success: true,
      message: "Enrollment status updated",
      status,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: "Failed to update enrollment status",
    });
  }
});

// DELETE /api/enrollments/:id - Delete an enrollment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await getEnrollmentById(parseInt(id));

    if (!enrollment) {
      return res.status(404).json({
        error: "Enrollment not found",
      });
    }

    await deleteEnrollment(parseInt(id));

    res.json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Failed to delete enrollment",
    });
  }
});

// GET /api/enrollments/available-slots - Get available time slots for a location and course type
router.get("/available-slots/:location/:courseType", async (req, res) => {
  try {
    const { location, courseType } = req.params;

    // Get all enrollments for this location and course type
    const allEnrollments = await getEnrollments();
    const enrollmentsForSlot = allEnrollments.filter(
      (e: any) => e.location === location && e.courseType === courseType && e.status === 'confirmed'
    );

    // Define available time slots
    const timeSlots = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    const days = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const maxCapacity = 4; // Max students per time slot

    // Build availability map
    const availability = days.flatMap(day => {
      return timeSlots.map(time => {
        // Count students already assigned to this day/time
        const enrolledCount = enrollmentsForSlot.filter(
          (e: any) => e.classDay === day && e.classTime === time
        ).length;

        const isAvailable = enrolledCount < maxCapacity;
        const spotsRemaining = maxCapacity - enrolledCount;

        return {
          day,
          time,
          isAvailable,
          spotsRemaining,
          enrolledCount,
        };
      });
    });

    res.json(availability);
  } catch (error) {
    console.error("Available slots error:", error);
    res.status(500).json({
      error: "Failed to fetch available slots",
    });
  }
});

// POST /api/enrollments/remove-duplicates - Remove duplicate enrollments
router.post("/remove-duplicates", async (req, res) => {
  try {
    const allEnrollments = await getEnrollments();
    
    // Group enrollments by email
    const enrollmentsByEmail: { [key: string]: any[] } = {};
    allEnrollments.forEach((enrollment: any) => {
      if (!enrollmentsByEmail[enrollment.email]) {
        enrollmentsByEmail[enrollment.email] = [];
      }
      enrollmentsByEmail[enrollment.email].push(enrollment);
    });
    
    let removedCount = 0;
    const duplicateInfo: any[] = [];
    
    // For each email with duplicates, keep the newest one (highest ID)
    for (const email in enrollmentsByEmail) {
      const enrollments = enrollmentsByEmail[email];
      
      if (enrollments.length > 1) {
        // Sort: by ID (newest first - higher ID = newer)
        enrollments.sort((a: any, b: any) => {
          return b.id - a.id; // Reverse order: newest first
        });
        
        // Keep the first one, delete the rest
        const keepEnrollment = enrollments[0];
        const toDelete = enrollments.slice(1);
        
        duplicateInfo.push({
          email,
          kept: keepEnrollment,
          deleted: toDelete.map((e: any) => ({ id: e.id, status: e.status }))
        });
        
        // Delete duplicates
        for (const enrollment of toDelete) {
          await deleteEnrollment(enrollment.id);
          removedCount++;
        }
      }
    }
    
    res.json({
      success: true,
      message: `Removed ${removedCount} duplicate enrollments`,
      removedCount,
      details: duplicateInfo
    });
  } catch (error) {
    console.error("Remove duplicates error:", error);
    res.status(500).json({
      error: "Failed to remove duplicates",
      message: (error as any).message
    });
  }
});

// POST /api/enrollments/auto-assign-slots - Auto-assign time slots to confirmed enrollments without slots
router.post("/auto-assign-slots", async (req, res) => {
  try {
    const allEnrollments = await getEnrollments();
    const timeSlots = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    const days = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Find confirmed enrollments without time slots (all course types)
    const needsAssignment = allEnrollments.filter((e: any) => 
      e.status === 'confirmed' && 
      (!e.classDay || !e.classTime)
    );
    
    let assignedCount = 0;
    const assignments: any[] = [];
    
    // Group by location
    const byLocation: { [key: string]: any[] } = {};
    needsAssignment.forEach((e: any) => {
      if (!byLocation[e.location]) {
        byLocation[e.location] = [];
      }
      byLocation[e.location].push(e);
    });
    
    // Assign time slots for each location
    for (const location in byLocation) {
      const enrollments = byLocation[location];
      let slotIndex = 0;
      
      for (const enrollment of enrollments) {
        const day = days[slotIndex % days.length];
        const time = timeSlots[Math.floor(slotIndex / days.length) % timeSlots.length];
        
        // Update enrollment with assigned slot
        await fetch(`http://localhost:3000/api/enrollments/${enrollment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classDay: day, classTime: time })
        });
        
        assignments.push({
          id: enrollment.id,
          name: `${enrollment.firstName} ${enrollment.lastName}`,
          location,
          assignedDay: day,
          assignedTime: time
        });
        
        assignedCount++;
        slotIndex++;
      }
    }
    
    res.json({
      success: true,
      message: `Auto-assigned ${assignedCount} time slots`,
      assignedCount,
      assignments
    });
  } catch (error) {
    console.error("Auto-assign slots error:", error);
    res.status(500).json({
      error: "Failed to auto-assign slots",
      message: (error as any).message
    });
  }
});

export default router;
