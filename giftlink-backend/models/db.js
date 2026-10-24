require('dotenv').config();
const { MongoClient } = require('mongodb');

let dbInstance = null;
let client = null;

async function connectToDatabase() {
  if (dbInstance) return dbInstance;

  client = new MongoClient(process.env.MONGO_URL);
  await client.connect();

  dbInstance = client.db('giftdb');
  return dbInstance;
}

module.exports = connectToDatabase;
