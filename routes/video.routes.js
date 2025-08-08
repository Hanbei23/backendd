import express from "express";
import {getVideo, setVideo, updateVideo, } from "../controller/video.controller.js";
import { authorize } from "../middleware/auth.middleware.js";


const videoRouter = express.Router();

videoRouter.get("/video", getVideo); // Ambil video aktif
videoRouter.post("/video", authorize, setVideo); // Tambah video baru
videoRouter.put("/video", authorize, updateVideo); // Update video

export default videoRouter;
