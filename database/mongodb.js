import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const DB_URI = process.env.MONGODB_URI; // langsung ambil dari environment
const NODE_ENV = process.env.NODE_ENV || "development";

if (!DB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`MongoDB connected: ${NODE_ENV}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectToDatabase;
