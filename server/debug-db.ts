import express from 'express';
import { getDb } from './db';
import { enrollments } from '../drizzle/schema';

const router = express.Router();

router.get('/debug/connection', async (req, res) => {
  try {
    // Test 1: Check environment variable
    const dbUrl = process.env.DATABASE_URL;
    const maskedUrl = dbUrl ? dbUrl.replace(/:[^@]+@/, ':***@') : 'NOT SET';
    
    // Test 2: Try to get database instance
    let dbConnected = false;
    let enrollmentCount = 0;
    let queryError = null;
    
    const db = await getDb();
    
    if (!db) {
      return res.json({
        environment: process.env.NODE_ENV,
        databaseUrl: maskedUrl,
        dbConnected: false,
        error: 'Database instance is null',
        timestamp: new Date().toISOString(),
      });
    }
    
    dbConnected = true;
    
    try {
      const result = await db.select().from(enrollments).limit(1);
      enrollmentCount = result.length > 0 ? 1 : 0;
    } catch (e: any) {
      queryError = e.message;
    }
    
    // Test 3: Try to count enrollments
    let totalEnrollments = 0;
    try {
      const countResult = await db.select().from(enrollments);
      totalEnrollments = countResult.length;
    } catch (e: any) {
      queryError = e.message;
    }
    
    res.json({
      environment: process.env.NODE_ENV,
      databaseUrl: maskedUrl,
      dbConnected,
      totalEnrollments,
      queryError: queryError || 'None',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Debug endpoint failed',
      message: error.message,
      stack: error.stack,
    });
  }
});

export default router;
