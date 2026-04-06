/**
 * User model — persists user identity across sessions.
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    color: {
      type: String,
      required: true,
    },
    lastPosition: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ isOnline: 1 });

export default mongoose.model('User', userSchema);