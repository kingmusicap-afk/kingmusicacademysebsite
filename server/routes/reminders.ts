import express from "express";
import { getDb } from "../db.js";
import { classReminders, enrollments } from "../../drizzle/schema.js";
import { eq, and, gte, lte } from "drizzle-orm";
import nodemailer from "nodemailer";

const router = express.Router();

// Initialize email transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Send WhatsApp message using Twilio
async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    // Format phone number for WhatsApp (add country code if needed)
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+230${phoneNumber}`;
    
    // Using WhatsApp API via Twilio or similar service
    // For now, we'll log it as a placeholder
    console.log(`[WhatsApp] Sending to ${formattedPhone}: ${message}`);
    
    // In production, integrate with Twilio or WhatsApp Business API
    // const response = await twilioClient.messages.create({
    //   from: 'whatsapp:+1234567890',
    //   to: `whatsapp:${formattedPhone}`,
    //   body: message,
    // });
    
    return { success: true, messageId: "whatsapp_placeholder" };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
}

// Send email reminder
async function sendEmailReminder(enrollment: any) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: enrollment.email,
      subject: `Reminder: Your ${enrollment.specificCourse} Class Tomorrow at King Music Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003D7A;">Class Reminder - King Music Academy</h2>
          <p>Dear ${enrollment.firstName},</p>
          <p>This is a friendly reminder that you have a class scheduled tomorrow:</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Course:</strong> ${enrollment.specificCourse}</p>
            <p><strong>Location:</strong> ${enrollment.location}</p>
            <p><strong>Time:</strong> Check your enrollment confirmation for exact time</p>
          </div>
          <p>Please arrive 10 minutes early to your class. If you need to reschedule or have any questions, please contact us:</p>
          <p>
            <strong>Email:</strong> kingmusicltd@gmail.com<br>
            <strong>WhatsApp:</strong> +230 57566278
          </p>
          <p>We look forward to seeing you!</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            King Music Academy - Professional Music Education
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email reminder:", error);
    throw error;
  }
}

// Send WhatsApp reminder
async function sendWhatsAppReminder(enrollment: any) {
  try {
    const message = `Hi ${enrollment.firstName}! 🎵\n\nReminder: You have a ${enrollment.specificCourse} class tomorrow at King Music Academy in ${enrollment.location}.\n\nPlease arrive 10 minutes early. If you need to reschedule, contact us:\n📧 kingmusicltd@gmail.com\n📱 +230 57566278`;
    
    return await sendWhatsAppMessage(enrollment.phone, message);
  } catch (error) {
    console.error("Error sending WhatsApp reminder:", error);
    throw error;
  }
}

// Create reminders for upcoming classes
router.post("/create-batch", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    // Get all active enrollments
    const allEnrollments = await db.select().from(enrollments);

    // For each enrollment, create a reminder for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const reminders = allEnrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      reminderDate: new Date(),
      classDate: tomorrow,
    }));

    if (reminders.length > 0) {
      await db.insert(classReminders).values(reminders as any);
    }

    res.json({ success: true, created: reminders.length });
  } catch (error) {
    console.error("Error creating batch reminders:", error);
    res.status(500).json({ error: "Failed to create reminders" });
  }
});

// Send pending reminders
router.post("/send-pending", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    const now = new Date();

    // Get reminders that need to be sent (emailSent = 0 or whatsappSent = 0)
    const pendingReminders = await db
      .select({
        reminder: classReminders,
        enrollment: enrollments,
      })
      .from(classReminders)
      .innerJoin(enrollments, eq(classReminders.enrollmentId, enrollments.id))
      .where(
        and(
          lte(classReminders.reminderDate, now),
          eq(classReminders.emailSent, 0)
        )
      );

    let emailsSent = 0;
    let whatsappsSent = 0;
    const errors = [];

    for (const { reminder, enrollment } of pendingReminders) {
      try {
        // Send email
        if (reminder.emailSent === 0) {
          await sendEmailReminder(enrollment);
          await db
            .update(classReminders)
            .set({
              emailSent: 1,
              emailSentAt: new Date(),
            })
            .where(eq(classReminders.id, reminder.id));
          emailsSent++;
        }

        // Send WhatsApp
        if (reminder.whatsappSent === 0) {
          await sendWhatsAppReminder(enrollment);
          await db
            .update(classReminders)
            .set({
              whatsappSent: 1,
              whatsappSentAt: new Date(),
            })
            .where(eq(classReminders.id, reminder.id));
          whatsappsSent++;
        }
      } catch (error) {
        console.error(`Error sending reminders for enrollment ${enrollment.id}:`, error);
        errors.push({
          enrollmentId: enrollment.id,
          error: (error as any).message,
        });
      }
    }

    res.json({
      success: true,
      emailsSent,
      whatsappsSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error sending pending reminders:", error);
    res.status(500).json({ error: "Failed to send reminders" });
  }
});

// Get reminder history
router.get("/history", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database not available" });
      return;
    }

    const history = await db
      .select({
        id: classReminders.id,
        firstName: enrollments.firstName,
        lastName: enrollments.lastName,
        email: enrollments.email,
        phone: enrollments.phone,
        specificCourse: enrollments.specificCourse,
        reminderDate: classReminders.reminderDate,
        classDate: classReminders.classDate,
        emailSent: classReminders.emailSent,
        whatsappSent: classReminders.whatsappSent,
        emailSentAt: classReminders.emailSentAt,
        whatsappSentAt: classReminders.whatsappSentAt,
      })
      .from(classReminders)
      .innerJoin(enrollments, eq(classReminders.enrollmentId, enrollments.id))
      .orderBy(classReminders.classDate);

    res.json(history);
  } catch (error) {
    console.error("Error fetching reminder history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
