import express from "express";
const routerAccount = express.Router();
import accountController from '../controllers/accountController.js';
import shortlinkController from "../controllers/shortlinkController.js";
import { requireAuthotp } from "../middleware/authMiddleware.js";

routerAccount.route('/send')
    .post(accountController.kirim_otp)


routerAccount.route('/verify',)
    .post(accountController.verifikasi)

routerAccount.route('/vmail')
    .get(accountController.verif_viamail)

routerAccount.route('/login')
    .post(accountController.login)

export default routerAccount;