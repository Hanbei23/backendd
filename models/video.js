import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
