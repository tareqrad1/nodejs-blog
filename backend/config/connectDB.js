import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected Successfully ✔ ${connect.connection.host}`);
    }catch(error) { 
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}