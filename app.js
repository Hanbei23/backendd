// ============================
import "./config/env.js";

import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";

import authRouter from "./routes/auth.route.js";
import antrianRouter from "./routes/antrian.route.js";
import videoRouter from "./routes/video.routes.js";
import repairRouter from "./routes/repair.route.js";

import connectToDatabase from "./database/mongodb.js";

const app = express();

// ============================
// 1) CORS (SATU KALI SAJA)
// ============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5500",
      "https://c-tracking.com",
      "https://hoppscotch.io",
      "http://hoppscotch.io",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ============================
// 2) BODY PARSER
// ============================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ============================
// 3) ROUTES
// ============================
app.use("/api/auth", authRouter);
app.use("/api/antrian", antrianRouter);
app.use("/api/link", videoRouter);
app.use("/api/repair", repairRouter);

// ============================
// 4) TEST
// ============================
app.get("/", (req, res) => {
  res.send("Welcome to the Toyota API");
});

// ============================
// 5) SERVER START
// ============================
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
