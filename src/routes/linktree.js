import express from "express";
const routerLinktree = express.Router();
import linktreeController from "../controllers/linktreeController.js"

routerLinktree.route('/')
    .get(linktreeController.linktreeMenu);

routerLinktree.route('/create-room')
    .post(linktreeController.createRoom);



routerLinktree.route('/res')
    .get(linktreeController.linktreeRes);

routerLinktree.route('/get/:id')
    .get(linktreeController.getLinktree);



export default routerLinktree;