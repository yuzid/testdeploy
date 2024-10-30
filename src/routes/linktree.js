import express from "express";
const routerLinktree = express.Router();
import linktreeController from "../controllers/linktreeController"

routerLinktree.route('/')
    .get(linktreeController.linktreeMenu());

routerLinktree.route('/')

export default routerLinktree;