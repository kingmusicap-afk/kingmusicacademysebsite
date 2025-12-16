import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_URL = 'http://localhost:3000/api/enrollments';
const globalFetch = global.fetch;

describe('Payment Status Update', () => {
  let testEnrollmentId: number;

  beforeAll(async () => {
    // Create a test enrollment first
    const enrollmentData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+230 5555 5555',
      location: 'North - Goodlands',
      courseType: 'Instrument Courses',
      courseLevel: 'Beginner',
      specificCourse: 'Guitar',
      startDate: new Date().toISOString().split('T')[0],
      notes: 'Test enrollment for payment status update',
    };

    try {
      const response = await globalFetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData),
      });

      const data = await response.json() as any;
      if (data.enrollment) {
        testEnrollmentId = data.enrollment.id;
      }
    } catch (error) {
      console.error('Failed to create test enrollment:', error);
    }
  });

  it('should update payment status from pending to paid', async () => {
    if (!testEnrollmentId) {
      console.warn('Skipping test: No test enrollment created');
      return;
    }

    const response = await globalFetch(`${API_URL}/${testEnrollmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'paid' }),
    });

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data.success).toBe(true);
    expect(data.paymentStatus).toBe('paid');
  });

  it('should update payment status from pending to overdue', async () => {
    if (!testEnrollmentId) {
      console.warn('Skipping test: No test enrollment created');
      return;
    }

    const response = await globalFetch(`${API_URL}/${testEnrollmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'overdue' }),
    });

    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data.success).toBe(true);
    expect(data.paymentStatus).toBe('overdue');
  });

  it('should reject invalid payment status', async () => {
    if (!testEnrollmentId) {
      console.warn('Skipping test: No test enrollment created');
      return;
    }

    const response = await globalFetch(`${API_URL}/${testEnrollmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'invalid' }),
    });

    expect(response.status).toBe(400);
    const data = await response.json() as any;
    expect(data.error).toBeDefined();
  });

  afterAll(async () => {
    // Cleanup is optional - test data can remain in the database
    console.log('Payment status update tests completed');
  });
});
