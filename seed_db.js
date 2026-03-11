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

const mockUsers = [
  {
    email: "mock_sarah@example.com",
    firstName: "Sarah",
    gender: "Woman",
    bio: "Love hiking and good coffee. Looking for someone to explore the city with.",
    imageUrls: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop"],
    location: "New York, NY",
    job: "Marketing Manager",
    school: "NYU",
    interests: ["Hiking", "Coffee", "Photography"],
    lookingFor: "A relationship",
  },
  {
    email: "mock_alex@example.com",
    firstName: "Alex",
    gender: "Man",
    bio: "Photographer and dog lover. Let's grab a drink.",
    imageUrls: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop"],
    location: "Brooklyn, NY",
    job: "Freelance Photographer",
    interests: ["Dogs", "Art", "Breweries"],
    lookingFor: "Something casual",
  },
  {
    email: "mock_emma@example.com",
    firstName: "Emma",
    gender: "Woman",
    bio: "Just moved here! Show me your favorite spots.",
    imageUrls: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop", 
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
    ],
    location: "Jersey City, NJ",
    job: "Data Analyst",
    interests: ["Foodie", "Travel", "Museums"],
    lookingFor: "A relationship",
  },
  {
    email: "mock_jason@example.com",
    firstName: "Jason",
    gender: "Man",
    bio: "Software engineer by day, amateur chef by night.",
    imageUrls: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop"],
    location: "Manhattan, NY",
    job: "Software Engineer",
    school: "Columbia University",
    interests: ["Cooking", "Tech", "Fitness"],
    lookingFor: "Don't know yet",
  }
];

async function seedDatabase() {
  await mongoose.connect(uri);
  try {
    console.log("Connected to MongoDB, inserting users...");
    for (const u of mockUsers) {
        // Upsert to handle replays safely
        await User.findOneAndUpdate({ email: u.email }, { $set: u }, { upsert: true, new: true, runValidators: true });
    }
    console.log("Mock data successfully seeded.");
  } catch (err) {
    console.error("Mongoose Error:", err.message);
  } finally {
    process.exit();
  }
}

seedDatabase();
