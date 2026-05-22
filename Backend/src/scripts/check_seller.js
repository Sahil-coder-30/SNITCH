import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";

dotenv.config({ path: "../../.env" });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is missing");
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");
    
    const users = await UserModel.find({});
    console.log("Found users in DB:");
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Username: ${u.username}, Email: ${u.email}, Role: ${u.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error connecting or querying:", error);
    process.exit(1);
  }
}

run();
