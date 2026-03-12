import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("school");
const stuCollection = db.collection("students");
const teacherCollection = db.collection("teachers");

// const result1 = await stuCollection.insertOne({ name: "Abhishek", age: 20 });
// const result2 = await teacherCollection.insertMany([
//   { name: "Nigam", age: 50 },
//   { name: "Sachin", age: 45 },
// ]);
// const cursor = teacherCollection.find({ projection: { name: 1, _id: 0 } });

const cursor = teacherCollection.find(
  { age: { $gt: 45 } },
  { projection: { name: 1, _id: 0 } },
);
const data = await cursor.toArray();
console.log(data);
client.close();
