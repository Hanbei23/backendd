import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    /* =========================
       IDENTITAS KENDARAAN
    ========================= */
    platNomor: {
      type: String,
      required: [true, "Plat nomor wajib diisi"],
      trim: true,
      uppercase: true,
    },

    modelMobil: {
      type: String,
      required: [true, "Model mobil wajib diisi"],
      trim: true,
    },

    pekerjaan: {
      type: String,
      required: [true, "Jenis pekerjaan wajib diisi"],
      enum: ["Heavy", "Medium", "Light"],
    },

    /* =========================
       TANGGAL (OPTIONAL DI AWAL)
    ========================= */
    estimasiSelesai: {
      type: Date,
      default: null,
    },

    spk: {
      type: Date,
      default: null,
    },

    penerimaanUnit: {
      type: Date,
      default: null,
    },

    /* =========================
       STATUS PEKERJAAN
    ========================= */
    statusPart: {
      type: String,
      enum: ["Order", "Complete"],
      default: "Order",
    },

    produksi: {
      type: String,
      enum: ["Proses", "Pending", "Final Inspeksi", "Finish"],
      default: "Proses",
    },

    /* =========================
       READY PICKUP (AUTO)
    ========================= */
    readyPickup: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Repair", repairSchema);
