import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

async function seedAdminManager() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const accounts = [
      {
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
        authProvider: "local",
      },
      {
        name: "Manager",
        email: "manager@example.com",
        role: "manager",
        authProvider: "local",
      },
    ];

    for (const account of accounts) {
      await User.updateOne(
        { email: account.email },
        { $setOnInsert: account },
        { upsert: true },
      );
    }

    console.log("Admin and Manager accounts are ready.");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAdminManager();
