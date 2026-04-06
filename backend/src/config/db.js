/**
 * MongoDB connection configuration.
 */
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-cosmos';
    await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error.message);
    console.warn('[DB] Running without database persistence. Messages will not be saved.');
  }
};