import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import antrianRouter from "./routes/antrian.route.js";
import connectToDatabase from "./database/mongodb.js";
import videoRouter from "./routes/video.routes.js";

const app = express();

// Gunakan dynamic CORS
const allowedOrigins = ["http://localhost:5173", "https://c-tracking.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle OPTIONS (preflight) agar CORS sukses
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/login", authRouter);
app.use("/api/antrian", antrianRouter);
app.use("/api/link", videoRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Toyota API");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
