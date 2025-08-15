import mongoose from "mongoose";

const antrianSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [true, 'Nama diperlukan'],
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    noHp: {
        type: String,
        required: [true, 'Nomor HP diperlukan'],
        trim: true,
        match: [/^\d{5,15}$/, 'Nomor HP tidak valid'],
    },
    platNomor: {
        type: String,
        required: [true, 'Plat nomor diperlukan'],
        trim: true,
        uppercase: true,
        minlength: 4,
        maxlength: 20,
    },
    jenisMobil: {
        type: String,
        required: [true, 'Jenis mobil diperlukan'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    tanggalServis: {
        type: Date,
        required: [true, 'Tanggal servis diperlukan'],
    },
    keterangan: {
        type: String,
        trim: true,
        maxlength: 255,
        default: '',
    },
    nomorAntrian: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['menunggu', 'selesai', 'sudah diambil'],
        default: 'menunggu',
    },
    lokasi: {
        type: String,
        default: 'Tunas Toyota Cimone',
        trim: true,
    },
    oli: {
        type : String,
        enum: ['synthetic', 'full synthtic', 'gold']
    },
    estimasi: {
        type: String,
        required: [true, 'Estimasi diperlukan'],
        trim: true,
        maxlength: 50,
    },
}, { timestamps: true });


const Antrian = mongoose.model('Antrian', antrianSchema);
export default Antrian;