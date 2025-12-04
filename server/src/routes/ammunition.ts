import { Router } from "express";
import {
  createAmmunition,
  getAmmunition,
  deleteAmmunition,
  getAmmunitionSummary,
} from "../handlers/ammunition";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", verifyToken, getAmmunition);
router.get("/summary", verifyToken, getAmmunitionSummary);
router.post("/", verifyToken, createAmmunition);
router.delete("/:id", verifyToken, deleteAmmunition);

export default router;
