import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import antrianRouter from "./routes/antrian.route.js";
import connectToDatabase from "./database/mongodb.js";
import videoRouter from "./routes/video.routes.js";

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://c-tracking.com"];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin like Postman or curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
  })
);

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
