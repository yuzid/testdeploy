import express from "express";
const routerShortlink = express.Router();
import shortlinkController from '../controllers/shortlinkController.js'; 

routerShortlink.route('/config')
    .post(shortlinkController.createSl)
    .patch(shortlinkController.updateSl)
    .delete(shortlinkController.deleteSl);

routerShortlink.route('/not-found')
    .get(shortlinkController.notFound);

routerShortlink.route('/res/:id')
    .get(shortlinkController.createResult);

routerShortlink.route('/get')
    .get(shortlinkController.getByID)

export default routerShortlink;