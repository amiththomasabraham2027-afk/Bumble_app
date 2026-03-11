const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional
  firstName: { type: String, default: '' },
  dob: { type: Date },
  bio: { type: String, default: '' },
  gender: { type: String },
  location: { type: String },
  interests: { type: [String], default: [] },
  job: { type: String },
  school: { type: String },
  lookingFor: { type: String },
  languages: { type: String },
  starSign: { type: String },
  drinks: { type: String },
  smokes: { type: String },
  pets: { type: String },
  maxDistance: { type: Number, default: 40 },
  ageRange: {
    min: { type: Number, default: 18 },
    max: { type: Number, default: 99 },
  },
  role: { type: String, default: 'user' },
  imageUrls: {
    type: [String],
    validate: [val => val.length <= 6, '{PATH} exceeds the limit of 6'],
  },
  isAllowed: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const uri = "mongodb+srv://amiththomas2005_db_user:gORYA3NYbh2jQOEo@cluster1.65gu6j7.mongodb.net/?appName=Cluster1";

async function run() {
  await mongoose.connect(uri);
  try {
    const res = await User.create({
      email: "test.google.random" + Math.random() + "@example.com",
      name: "Test User",
      firstName: "Test",
      imageUrls: ["http://example.com/image.png"],
      dob: new Date('2000-01-01'),
      gender: 'unspecified',
    });
    console.log("Success!");
  } catch (err) {
    console.error("Mongoose Error:", err.message);
  }
  process.exit();
}

run();
