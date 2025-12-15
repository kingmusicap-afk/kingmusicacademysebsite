import { Router } from "express";
import { createEnrollment, getEnrollments, getEnrollmentById, updateEnrollmentStatus } from "../db.js";
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
      location,
      courseType,
      courseLevel,
      specificCourse,
      parentName,
      parentPhone,
      previousExperience,
      startDate,
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
      location,
      courseType,
      courseLevel,
      specificCourse,
      parentName: parentName || undefined,
      parentPhone: parentPhone || undefined,
      previousExperience: previousExperience || undefined,
      startDate,
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
        <li>Subscription Fee: Rs 1,200 per month</li>
        <li>Payment Method: Juice by MCB (57566278)</li>
        <li>Please include your full name in the payment message</li>
        <li><strong style="color: red;">This is a NON-REFUNDABLE subscription fee</strong></li>
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

export default router;
