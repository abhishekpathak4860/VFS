// config/db.js
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connUri =
      process.env.MONGO_URI ||
      "mongodb://abhi:abhi@localhost:27017/storageApp?replicaSet=myReplicaSet";

    await mongoose.connect(connUri);

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("MongoDB Connection Failed");
    console.log(err);
    process.exit(1);
  }
}
