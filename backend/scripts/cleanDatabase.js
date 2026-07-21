import mongoose from "mongoose";
import dotenv from "dotenv";
import * as Models from "../models/index.js";

dotenv.config();

const cleanDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Get all model names
    const modelList = Object.values(Models);

    console.log(`\n🧹 Starting database cleanup...`);
    console.log(`Found ${modelList.length} models to clean\n`);

    let totalDeleted = 0;

    // Delete all documents from each collection
    for (const Model of modelList) {
      const modelName = Model.collection.name;
      const result = await Model.deleteMany({});
      console.log(`✓ ${modelName}: Deleted ${result.deletedCount} documents`);
      totalDeleted += result.deletedCount;
    }

    console.log(`\n✅ Database cleanup complete!`);
    console.log(`Total documents deleted: ${totalDeleted}`);

    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB\n");
  } catch (error) {
    console.error("❌ Error during cleanup:", error.message);
    process.exit(1);
  }
};

cleanDatabase();
