import { Router } from "express";
import { getAData } from "./controller.js";
import { getADataById } from "./controller.js";

const router = Router();

router.get("/", getAData);
router.get("/:id", getADataById);

export default router;