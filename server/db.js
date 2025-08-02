// db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

let client;
let db;

async function connectToDB() {
  // Reuse existing connection if already connected
  if (db) return db;

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "spanishAssistantDB";

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db(dbName);

  console.log(`✅ Connected to MongoDB database: ${dbName}`);
  return db;
}

module.exports = { connectToDB };
