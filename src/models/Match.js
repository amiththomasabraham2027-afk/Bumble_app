import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const MatchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  messages: [MessageSchema],
  expiresAt: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);
