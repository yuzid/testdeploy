import express from 'express';
const routerQr = express.Router();
import multer from 'multer';
import QrController from '../controllers/QrController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


routerQr.route('/generateQR')
    .post(upload.single('logo'),QrController.generateQRCode)

routerQr.route('/')
    .get(QrController.qrmain)


export default routerQr;
