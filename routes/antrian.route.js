import { Router } from "express";
import {
  tambahAntrian,
  editAntrian,
  getAntrianByNomor,
  getAntrianHariIni,
  hapusAntrian,
  getAntrianByTanggal,
  editStatusById,
  getAntrianOliHariIni,
  getDetailAntrianById,
  getAntrianByPerusahaan,
  exportAntrianExcel,
  hapusAntrianByTanggal,
} from "../controller/antrian.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const antrianRouter = Router();

antrianRouter.post("/add", authorize, tambahAntrian);
antrianRouter.put("/edit/:id", authorize, editAntrian);
antrianRouter.get("/plat/:platNomor", getAntrianByNomor);
antrianRouter.delete("/nomor/:id", authorize, hapusAntrian);
antrianRouter.get("/now", authorize, getAntrianHariIni);
antrianRouter.get("/tanggal", authorize, getAntrianByTanggal);
antrianRouter.put("/nomor/:id", authorize, editStatusById);
antrianRouter.get("/display", authorize, getAntrianOliHariIni);
antrianRouter.get("/displayUser", getAntrianOliHariIni);
antrianRouter.get("/detail/:id", getDetailAntrianById);
antrianRouter.get("/perusahaan", getAntrianByPerusahaan);
antrianRouter.get("/export/excel", exportAntrianExcel);
antrianRouter.delete("/by-tanggal", authorize, hapusAntrianByTanggal);

export default antrianRouter;
