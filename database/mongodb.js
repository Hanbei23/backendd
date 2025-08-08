import mongoose from 'mongoose';
import { DB_URI, NODE_ENV} from '../config/env.js';
mongoose.set('strictQuery', false);

if (!DB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`MongoDB connected: ${NODE_ENV}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectToDatabase;