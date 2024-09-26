import express from "express";
const routerAccount = express.Router();
import accountController from '../controllers/accountController.js';
import shortlinkController from "../controllers/shortlinkController.js";

routerAccount.route('/send')
    .post(accountController.kirim_otp)


export default routerAccount;