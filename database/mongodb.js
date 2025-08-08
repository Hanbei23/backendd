import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const DB_URI = process.env.DB_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

if (!DB_URI) {
  throw new Error("Please define the DB_URI environment variable");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${NODE_ENV}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectToDatabase;
