import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Optional because OAuth users (like Google) won't have a password
  },
  firstName: {
    type: String,
    default: '',
  },
  dob: {
    type: Date,
  },
  bio: {
    type: String,
    default: '',
  },
  gender: {
    type: String, // 'Man', 'Woman', 'Non-binary', 'Other'
  },
  location: {
    type: String,
  },
  interests: {
    type: [String],
    default: [],
  },
  job: {
    type: String,
  },
  school: {
    type: String,
  },
  lookingFor: {
    type: String,
  },
  languages: {
    type: String,
  },
  starSign: {
    type: String,
  },
  drinks: {
    type: String,
  },
  smokes: {
    type: String,
  },
  pets: {
    type: String,
  },
  maxDistance: {
    type: Number,
    default: 40,
  },
  ageRange: {
    min: { type: Number, default: 18 },
    max: { type: Number, default: 99 },
  },
  role: {
    type: String,
    default: 'user',
  },
  imageUrls: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 6'],
  },
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  }],
  liked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  passed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isAllowed: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 6;
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
