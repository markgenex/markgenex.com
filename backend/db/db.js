import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB, Database:", DB_NAME);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;
