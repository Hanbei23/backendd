import Video from "../models/video.js";

// GET /video → ambil video terbaru
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findOne().sort({ updatedAt: -1 });
    if (!video) {
      return res.status(404).json({ message: "Belum ada video yang disetel" });
    }
    return res.status(200).json({ message: "Video ditemukan", data: video });
  } catch (err) {
    console.error("Gagal ambil video:", err);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /video → simpan video baru (sekali saja)
export const setVideo = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL video tidak boleh kosong" });
    }

    const video = new Video({ url });
    await video.save();

    return res
      .status(201)
      .json({ message: "Video berhasil disimpan", data: video });
  } catch (err) {
    console.error("Gagal simpan video:", err);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// PUT /video → update URL video
export const updateVideo = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL video tidak boleh kosong" });
    }

    const updated = await Video.findOneAndUpdate(
      {},
      { url, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "Video berhasil diperbarui",
      data: updated,
    });
  } catch (err) {
    console.error("Gagal update video:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
};
