import { config } from "dotenv";
import fs from "fs";

// Cek apakah file .env.<NODE_ENV>.local ada di disk
const envFilePath = `.env.${process.env.NODE_ENV || "development"}.local`;

if (fs.existsSync(envFilePath)) {
  // Kalau ada, load untuk lokal
  config({ path: envFilePath });
} else {
  // Kalau nggak ada (misal di Railway), load default .env kalau ada
  config();
}

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const SERVER_URL = process.env.SERVER_URL;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
