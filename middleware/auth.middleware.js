import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.js";

export const authorize = async (req, res, next) => {
  try {
    let token;

    // Cek token di header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Jika token tidak ada
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak ditemukan.",
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Cari user berdasarkan ID
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Akun tidak ditemukan.",
      });
    }

    // Simpan info user ke req
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau kadaluarsa.",
      error: error.message,
    });
  }
};
