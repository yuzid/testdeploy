import { Router } from "express";
import { getShortlinksPaginated } from "./controller.js";

const router = Router();

router.get("/shortlinks/:email", getShortlinksPaginated);

export default router;