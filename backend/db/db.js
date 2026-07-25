import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

function getConnectionUri() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is required");
    }

    try {
        const parsed = new URL(uri);
        if (!parsed.pathname || parsed.pathname === "/") {
            parsed.pathname = `/${DB_NAME}`;
        }
        return parsed.toString();
    } catch {
        return uri.endsWith("/") ? `${uri}${DB_NAME}` : `${uri}/${DB_NAME}`;
    }
}

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(getConnectionUri());
        console.log("Connected to MongoDB, Database:", connection.connection.name);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;
