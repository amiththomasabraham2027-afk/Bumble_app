const mongoose = require('mongoose');
const uri = "mongodb+srv://amiththomas2005_db_user:gORYA3NYbh2jQOEo@cluster1.65gu6j7.mongodb.net/?appName=Cluster1";

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.useDb('test'); // NextAuth standard fallback or check dbName
  const users = await db.collection('users').find({}).toArray();
  console.log("Found Users:", users);
  process.exit();
}
run();
