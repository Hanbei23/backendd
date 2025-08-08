import Antrian from "../models/antrian.js";
import moment from "moment";
import mongoose from 'mongoose';

export const tambahAntrian = async (req, res) => {
  try {
    const {
      nama,
      noHp,
      platNomor,
      jenisMobil,
      tanggalServis,
      keterangan = "",
      lokasi = "Tunas Toyota Cimone",
      oli,
      estimasi, 
    } = req.body;

    if (!nama || !noHp || !platNomor || !jenisMobil || !tanggalServis || !oli || !estimasi) {
      return res.status(400).json({ message: "Semua wajib di isi" });
    }

    const validOli = ['synthetic', 'full synthtic', 'gold'];
    if (!validOli.includes(oli)) {
      return res.status(400).json({ message: "Jenis oli tidak valid!" });
    }

    const servisDate = moment(tanggalServis).startOf("day").toDate();
    const startOfDay = moment(servisDate).startOf("day").toDate();
    const endOfDay = moment(servisDate).endOf("day").toDate();

    const jumlahAntrianHariIni = await Antrian.countDocuments({
      tanggalServis: { $gte: startOfDay, $lte: endOfDay }
    });

    const nomorAntrian = jumlahAntrianHariIni + 1;

    const antrianBaru = new Antrian({
      nama,
      noHp,
      platNomor: platNomor.toUpperCase(),
      jenisMobil,
      tanggalServis: servisDate,
      keterangan,
      nomorAntrian,
      lokasi,
      oli,
      estimasi, 
    });

    await antrianBaru.save();

    return res.status(201).json({
      message: "Antrian berhasil ditambahkan",
      data: antrianBaru
    });

  } catch (error) {
    console.error("Error tambah antrian:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

export const editAntrian = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['menunggu', 'selesai', 'sudah diambil'].includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        const antrian = await Antrian.findById(id);
        if (!antrian) {
            return res.status(404).json({ message: 'Data antrian tidak ditemukan' });
        }

        antrian.status = status;
        await antrian.save();

        if (status === 'selesai') {
            return res.status(200).json({
                message: 'Status berhasil diubah menjadi selesai',
                data: {
                    status: antrian.status,
                    nama: antrian.nama,
                    noHp: antrian.noHp,
                    platNomor: antrian.platNomor,
                },
            });
        }

        return res.status(200).json({ message: 'Status berhasil diperbarui' });

    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

export const getAntrianByNomor = async (req, res) => {
  try {
    const { platNomor } = req.params;
    const tanggalServis = req.query.tanggalServis || req.body.tanggalServis;

    if (!tanggalServis) {
      return res.status(400).json({
        message: "tanggal servis wajib diisi"
      });
    }

    const startOfDay = moment(tanggalServis).startOf("day").toDate();
    const endOfDay = moment(tanggalServis).endOf("day").toDate();

    const antrian = await Antrian.findOne({
      platNomor: { $regex: new RegExp(`^${platNomor}$`, "i") },
      tanggalServis: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!antrian) {
      return res.status(404).json({ message: "Antrian tidak ditemukan pada tanggal tersebut" });
    }

    return res.status(200).json({
      nomorAntrian: antrian.nomorAntrian,
      platNomor: antrian.platNomor,
      lokasi: antrian.lokasi,
      status: antrian.status,
      tanggalServis: antrian.tanggalServis
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

export const getAntrianHariIni = async (req, res) => {
  try {
    const today = moment().startOf("day").toDate();
    const endOfToday = moment().endOf("day").toDate();
    const { status } = req.query;

    const filter = {
      tanggalServis: { $gte: today, $lte: endOfToday }
    };
    if (status) {
      filter.status = status;
    }

    const antrianHariIni = await Antrian.find(filter)
      .sort({ nomorAntrian: 1 })
      .select("nama nomorAntrian platNomor noHp status"); // ✅ tambahkan status

    const [menunggu, selesai, sudahDiambil] = await Promise.all([
      Antrian.countDocuments({ tanggalServis: { $gte: today, $lte: endOfToday }, status: "menunggu" }),
      Antrian.countDocuments({ tanggalServis: { $gte: today, $lte: endOfToday }, status: "selesai" }),
      Antrian.countDocuments({ tanggalServis: { $gte: today, $lte: endOfToday }, status: "sudah diambil" }),
    ]);

    return res.status(200).json({
      message: "Daftar antrian untuk hari ini",
      filterStatus: status || "semua",
      total: antrianHariIni.length,
      summary: {
        menunggu,
        selesai,
        sudahDiambil,
      },
      data: antrianHariIni
    });

  } catch (error) {
    console.error("Error getAntrianHariIni:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

export const hapusAntrian = async (req, res) => {
  try {
    const { id } = req.params;

    const antrian = await Antrian.findById(id);
    if (!antrian) {
      return res.status(404).json({ message: "Data antrian tidak ditemukan" });
    }

    await Antrian.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Data antrian berhasil dihapus",
      data: {
        id: antrian._id,
        nama: antrian.nama,
        nomorAntrian: antrian.nomorAntrian,
        tanggalServis: antrian.tanggalServis,
      },
    });
  } catch (error) {
    console.error("Error hapusAntrian:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export const getAntrianByTanggal = async (req, res) => {
  try {
    const { tanggal } = req.query;

    if (!tanggal) {
      return res.status(400).json({
        message: "Tanggal wajib diisi dalam format Date (ISO string)"
      });
    }

    const parsedDate = new Date(tanggal);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Format tanggal tidak valid" });
    }

    const startOfDay = moment(parsedDate).startOf("day").toDate();
    const endOfDay = moment(parsedDate).endOf("day").toDate();

    const antrian = await Antrian.find({
      tanggalServis: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({ nomorAntrian: 1 })
      .select("nama nomorAntrian noHp status platNomor createdAt");

    return res.status(200).json({
      message: `Daftar antrian untuk tanggal ${moment(parsedDate).format("YYYY-MM-DD")}`,
      total: antrian.length,
      data: antrian
    });

  } catch (error) {
    console.error("Error getAntrianByTanggal:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

export const editStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    if (status && !['menunggu', 'selesai', 'sudah diambil'].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }
    const updated = await Antrian.findByIdAndUpdate(
      id,
      { status },
      {
        new: true, 
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Data antrian tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Data antrian berhasil diperbarui",
      data: {
        id: updated._id,
        nama: updated.nama,
        nomorAntrian: updated.nomorAntrian,
        platNomor: updated.platNomor,
        noHp: updated.noHp,
        status: updated.status,
        tanggalServis: updated.tanggalServis,
      }
    });

  } catch (error) {
    console.error("Error editStatusById:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

export const getAntrianOliHariIni = async (req, res) => {
  try {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    const antrianHariIni = await Antrian.find({
      tanggalServis: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({ nomorAntrian: 1 })
      .select("nomorAntrian platNomor oli status estimasi createdAt");

    return res.status(200).json({
      message: "Daftar antrian hari ini",
      total: antrianHariIni.length,
      data: antrianHariIni
    });

  } catch (error) {
    console.error("Error getAntrianOliHariIni:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

export const getDetailAntrianById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Permintaan detail antrian dengan ID:", id); // LOG 1

    // Cek validitas ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ ID tidak valid:", id); // LOG 2
      return res.status(400).json({ message: "ID tidak valid" });
    }

    // Coba ambil data dari database
    const antrian = await Antrian.findById(id)
      .select("nama noHp platNomor jenisMobil tanggalServis keterangan nomorAntrian status oli estimasi");

    // Cek jika data tidak ditemukan
    if (!antrian) {
      console.log("⚠️ Antrian tidak ditemukan untuk ID:", id); // LOG 3
      return res.status(404).json({ message: "Antrian tidak ditemukan" });
    }

    console.log("✅ Detail antrian ditemukan:", antrian); // LOG 4

    res.status(200).json(antrian);
  } catch (error) {
    console.error("🔥 ERROR saat mengambil detail antrian:", error); // LOG 5
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};