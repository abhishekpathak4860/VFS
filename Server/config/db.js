// // mongo db connection logic
// import { MongoClient } from "mongodb";
// // aws instance ip address 13.232.231.72
// export const client = new MongoClient(
//   "mongodb://abhi:abhi@localhost:27017/storageApp?replicaSet=myReplicaSet",
// );

// export async function connectDB() {
//   await client.connect();
//   const db = client.db();
//   await db.collection("directories").createIndex({ parentDir: 1 });
//   await db.collection("files").createIndex({ parentDir: 1 });
//   return db;
// }

// process.on("SIGINT", async () => {
//   await client.close();
//   console.log("db disconnected successfully");
//   process.exit(0);
// });

// config/db.js

import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb://abhi:abhi@localhost:27017/storageApp?replicaSet=myReplicaSet",
    );

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("MongoDB Connection Failed");
    console.log(err);
    process.exit(1);
  }
}
