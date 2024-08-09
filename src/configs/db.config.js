import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.DB_URI}/${DB_NAME}`,
            {
                serverSelectionTimeoutMS: 10000, // 10 seconds
                socketTimeoutMS: 45000, // 45 seconds
            }
        );
        console.log(
            `\nDB connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("DB connection failed", error);
        process.exit(1);
    }
};

export default connectDB;
