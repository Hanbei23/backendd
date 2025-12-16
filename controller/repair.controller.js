import Repair from "../models/repair.js";

/* ======================================================
   HELPER
====================================================== */
const toDateOnly = (val) => {
  if (!val) return null;
  const d = new Date(val + "T00:00:00");
  return isNaN(d) ? null : d;
};

/* ======================================================
   CREATE (ANTRIAN)
====================================================== */
export const createRepair = async (req, res) => {
  try {
    const payload = { ...req.body };

    // NORMALISASI PLAT
    payload.platNomor = payload.platNomor?.toUpperCase().trim();

    // VALIDASI MINIMAL (ANTRIAN)
    if (!payload.platNomor || !payload.modelMobil || !payload.pekerjaan) {
      return res.status(400).json({
        success: false,
        message: "Plat nomor, model mobil, dan pekerjaan wajib diisi",
      });
    }

    // CEK DUPLIKAT
    const exist = await Repair.findOne({ platNomor: payload.platNomor });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Plat nomor sudah terdaftar",
      });
    }

    // OPTIONAL DATE
    payload.estimasiSelesai = toDateOnly(payload.estimasiSelesai);
    payload.spk = toDateOnly(payload.spk);
    payload.penerimaanUnit = toDateOnly(payload.penerimaanUnit);

    const repair = await Repair.create(payload);

    return res.status(201).json({
      success: true,
      message: "Data antrian repair berhasil ditambahkan",
      data: repair,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan data antrian repair",
      error: error.message,
    });
  }
};

/* ======================================================
   UPDATE
====================================================== */
export const updateRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "statusPart",
      "produksi",
      "readyPickup",
      "estimasiSelesai",
      "spk",
      "penerimaanUnit",
    ];

    const payload = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    });

    // FIX DATE
    if (payload.estimasiSelesai)
      payload.estimasiSelesai = toDateOnly(payload.estimasiSelesai);
    if (payload.spk) payload.spk = toDateOnly(payload.spk);
    if (payload.penerimaanUnit)
      payload.penerimaanUnit = toDateOnly(payload.penerimaanUnit);
    if (payload.readyPickup)
      payload.readyPickup = toDateOnly(payload.readyPickup);

    // AUTO READY PICKUP
    if (payload.produksi === "Finish" && !payload.readyPickup) {
      payload.readyPickup = new Date();
    }

    const updated = await Repair.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Data repair tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data repair berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Gagal memperbarui data repair",
      error: error.message,
    });
  }
};

/* ======================================================
   GET ALL
====================================================== */
export const getAllRepair = async (req, res) => {
  try {
    const repairs = await Repair.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: repairs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data repair",
      error: error.message,
    });
  }
};

/* ======================================================
   GET BY ID
====================================================== */
export const getRepairById = async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Data repair tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: repair,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data repair",
      error: error.message,
    });
  }
};

/* ======================================================
   GET LATEST
====================================================== */
export const getLatestRepair = async (req, res) => {
  try {
    const repair = await Repair.findOne().sort({ createdAt: -1 });

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Belum ada data repair",
      });
    }

    return res.status(200).json({
      success: true,
      data: repair,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data terbaru",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE BY ID
====================================================== */
export const deleteRepairById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Repair.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Data repair tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data repair berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus data repair",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE ALL
====================================================== */
export const deleteAllRepair = async (req, res) => {
  try {
    const result = await Repair.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Semua data repair berhasil dihapus",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus semua data repair",
      error: error.message,
    });
  }
};
