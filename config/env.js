import dotenv from "dotenv";
import path from "path";

/**
 * Load env sesuai NODE_ENV
 * default: development
 */
dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}.local`
  ),
});

// OPTIONAL: validasi biar gampang debug
const requiredEnvs = [
  "PORT",
  "NODE_ENV",
  "DB_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ ENV ${key} tidak ditemukan`);
    process.exit(1);
  }
});

export const {
  PORT,
  NODE_ENV,
  SERVER_URL,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = process.env;
