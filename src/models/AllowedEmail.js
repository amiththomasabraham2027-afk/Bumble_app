import mongoose from 'mongoose';

const AllowedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAllowed: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.AllowedEmail || mongoose.model('AllowedEmail', AllowedEmailSchema);
