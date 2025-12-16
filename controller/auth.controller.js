import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

/* ================= SIGN UP ================= */
export const signUp = async (req, res) => {
  try {
    let { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGN UP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal registrasi",
      error: error.message,
    });
  }
};

/* ================= SIGN IN ================= */
export const signIn = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email tidak terdaftar",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGN IN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal login",
      error: error.message,
    });
  }
};
