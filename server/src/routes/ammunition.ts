import { Router } from "express";
import {
  createAmmunition,
  getAmmunition,
  deleteAmmunition,
  getAmmunitionSummary,
} from "../handlers/ammunition";

const router = Router();

router.get("/", getAmmunition);
router.get("/summary", getAmmunitionSummary);
router.post("/", createAmmunition);
router.delete("/:id", deleteAmmunition);

export default router;
