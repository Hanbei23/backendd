import { Router } from 'express';
import { tambahAntrian, editAntrian, getAntrianByNomor, getAntrianHariIni, hapusAntrian, getAntrianByTanggal, editStatusById, getAntrianOliHariIni, getDetailAntrianById} from '../controller/antrian.controller.js';
import { authorize } from '../middleware/auth.middleware.js';

const antrianRouter = Router()

antrianRouter.post('/add', authorize, tambahAntrian);
antrianRouter.put('/edit/:id', authorize, editAntrian);
antrianRouter.get('/plat/:platNomor', getAntrianByNomor);
antrianRouter.delete('/nomor/:id', authorize, hapusAntrian);
antrianRouter.get('/now', authorize, getAntrianHariIni);
antrianRouter.get('/tanggal', authorize, getAntrianByTanggal);
antrianRouter.put('/nomor/:id', authorize, editStatusById);
antrianRouter.get('/display', authorize, getAntrianOliHariIni);
antrianRouter.get('/displayUser', getAntrianOliHariIni);
antrianRouter.get("/detail/:id", getDetailAntrianById);

export default antrianRouter;
