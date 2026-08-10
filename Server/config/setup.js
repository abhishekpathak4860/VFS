import { connectDB } from "./db.js";
import mongoose from "mongoose";

await connectDB();
const client = mongoose.connection.getClient();
try {
  const db = mongoose.connection.db;

  await db.command({
    collMod: "users",
    validator: {
      $jsonSchema: {
        required: ["name", "email", "password", "rootDirId"],
        properties: {
          name: {
            bsonType: "string",
            minLength: 3,
          },
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          },
          password: {
            bsonType: "string",
            minLength: 2,
          },
          rootDirId: {
            bsonType: "objectId",
          },
        },
        additionalProperties: true,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });

  await db.command({
    collMod: "directories",
    validator: {
      $jsonSchema: {
        required: ["name", "ownerId", "parentDir", "type"],
        properties: {
          name: {
            bsonType: "string",
          },
          ownerId: {
            bsonType: ["null", "objectId"],
          },
          parentDir: {
            bsonType: "objectId",
          },
          type: {
            bsonType: "string",
          },
        },
        additionalProperties: true,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });

  await db.command({
    collMod: "files",
    validator: {
      $jsonSchema: {
        required: ["extension", "name", "ownerId", "parentDir", "type"],
        properties: {
          extension: {
            bsonType: "string",
          },
          name: {
            bsonType: "string",
          },
          ownerId: {
            bsonType: "objectId",
          },
          parentDir: {
            bsonType: "objectId",
          },
          type: {
            bsonType: "string",
          },
        },
        additionalProperties: true,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });
} catch (err) {
  console.log("validation error", err);
} finally {
  await client.close();
}
