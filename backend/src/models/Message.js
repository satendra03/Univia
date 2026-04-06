/**
 * Message model — persists chat messages with TTL auto-cleanup.
 */
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    senderColor: { type: String, required: true },
    content: { type: String, required: true, trim: true, maxlength: 500 },
    roomId: { type: String, default: 'global' },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
messageSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);