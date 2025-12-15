import { describe, it, expect, beforeAll } from "vitest";
import nodemailer from "nodemailer";

describe("Gmail SMTP Configuration", () => {
  let transporter: nodemailer.Transporter;

  beforeAll(() => {
    const gmailPassword = process.env.GMAIL_PASSWORD;
    
    if (!gmailPassword) {
      throw new Error("GMAIL_PASSWORD environment variable is not set");
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kingmusicltd@gmail.com",
        pass: gmailPassword,
      },
    });
  });

  it("should verify Gmail SMTP credentials are valid", async () => {
    try {
      await transporter.verify();
      expect(true).toBe(true);
    } catch (error) {
      throw new Error(`Gmail SMTP verification failed: ${(error as any).message}`);
    }
  });

  it("should be able to send a test email", async () => {
    try {
      const info = await transporter.sendMail({
        from: "kingmusicltd@gmail.com",
        to: "kingmusicltd@gmail.com",
        subject: "King Music Academy - Email System Test",
        html: "<h1>Test Email</h1><p>If you receive this, Gmail SMTP is working correctly!</p>",
      });

      expect(info.messageId).toBeDefined();
      expect(info.response).toBeDefined();
    } catch (error) {
      throw new Error(`Failed to send test email: ${(error as any).message}`);
    }
  });
});
