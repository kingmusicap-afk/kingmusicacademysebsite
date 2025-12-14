import { describe, it, expect } from 'vitest';
import nodemailer from 'nodemailer';

describe('Email Configuration', () => {
  it('should validate Gmail credentials', async () => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    try {
      // Verify the transporter connection
      const verified = await transporter.verify();
      expect(verified).toBe(true);
      console.log('✓ Gmail credentials are valid');
    } catch (error) {
      console.error('✗ Gmail credentials validation failed:', error);
      throw new Error('Gmail credentials are invalid or SMTP connection failed');
    }
  });

  it('should have required environment variables', () => {
    expect(process.env.GMAIL_USER).toBeDefined();
    expect(process.env.GMAIL_PASSWORD).toBeDefined();
    expect(process.env.GMAIL_USER).toMatch(/@gmail\.com$/);
  });
});
