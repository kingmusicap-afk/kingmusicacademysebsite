import { Router } from "express";
import { createEnrollment, getEnrollments, getEnrollmentById, updateEnrollmentStatus } from "../db.js";
import sgMail from "@sendgrid/mail";

const router = Router();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// POST /api/enrollments - Create a new enrollment
router.post("/", async (req, res) => {
  try {
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
      <p>We will contact you shortly to confirm your enrollment and discuss payment details.</p>
      <p>For any questions, please reply to this email or contact us at kingmusicltd@gmail.com</p>
      <p>Best regards,<br/>King Music Academy Team</p>
    `;

    try {
      await sgMail.send({
        to: email,
        from: "noreply@kingmusicacademy.com",
        subject: "Welcome to King Music Academy - Enrollment Confirmation",
        html: studentEmailHtml,
      });
      console.log(`✓ Student confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send student email:", emailError);
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
      await sgMail.send({
        to: "kingmusicltd@gmail.com",
        from: "noreply@kingmusicacademy.com",
        subject: `New Enrollment: ${firstName} ${lastName} - ${specificCourse}`,
        html: academyEmailHtml,
      });
      console.log(`✓ Admin notification email sent`);
    } catch (emailError) {
      console.error("Failed to send admin email:", emailError);
    }

    res.json({
      success: true,
      message: "Enrollment submitted successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      error: "Failed to process enrollment",
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
