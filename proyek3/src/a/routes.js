import { Router } from "express";
import { getShortlinksPaginated } from "./controller.js";

const router = Router();

router.get("/:email", getShortlinksPaginated);

export default router;