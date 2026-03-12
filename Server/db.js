// mongo db connection logic
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");

export async function connectDB() {
  await client.connect();
  const db = client.db();
  await db.collection("directories").createIndex({ parentDir: 1 });
  await db.collection("files").createIndex({ parentDir: 1 });
  return db;
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("db disconnected successfully");
  process.exit(0);
});
