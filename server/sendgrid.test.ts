import { describe, it, expect } from 'vitest';

describe('SendGrid Configuration', () => {
  it('should have SendGrid API key configured', () => {
    expect(process.env.SENDGRID_API_KEY).toBeDefined();
    expect(process.env.SENDGRID_API_KEY).toMatch(/^SG\./);
  });

  it('should validate SendGrid API key format', async () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^SG\.[a-zA-Z0-9_.-]+$/);
    
    // Test the API key by making a simple request to SendGrid
    try {
      const response = await fetch('https://api.sendgrid.com/v3/user/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      // We expect a successful response (200-299 or 401 if key is invalid)
      expect([200, 401, 403]).toContain(response.status);
      if (response.status === 200) {
        console.log('✓ SendGrid API key is valid and working');
      } else {
        throw new Error(`SendGrid API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('✗ SendGrid API validation failed:', error);
      throw new Error('SendGrid API key validation failed');
    }
  });
});
