import mongoose from 'mongoose';
import User from '../src/models/User.js';

const uri = "mongodb+srv://amiththomas2005_db_user:gORYA3NYbh2jQOEo@cluster1.65gu6j7.mongodb.net/?appName=Cluster1";

async function run() {
  await mongoose.connect(uri);
  try {
    const res = await User.create({
      email: "test.google@example.com",
      name: "Test User",
      firstName: "Test",
      imageUrls: ["http://example.com/image.png"],
      dob: new Date('2000-01-01'),
      gender: 'unspecified',
    });
    console.log("Success!", res);
  } catch (err) {
    console.error("Mongoose Error:", err.message);
  }
  process.exit();
}

run();
