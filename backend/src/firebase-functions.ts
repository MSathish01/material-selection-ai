import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import materialRoutes from './routes/materials';
import aiRoutes from './routes/ai';
import standardsRoutes from './routes/standards';
import chatRoutes from './routes/chat';
import advancedRoutes from './routes/advanced';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'https://your-project-id.web.app',
    'https://your-project-id.firebaseapp.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    await rateLimiter.consume(ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' });
  }
});

// Routes
app.use('/api/materials', materialRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/standards', standardsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/advanced', advancedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  try {
    const config = functions.config();
    const mongoUri = config.mongodb?.uri || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured');
    }

    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

// Initialize DB connection
connectDB().catch(console.error);

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
