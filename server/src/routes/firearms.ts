import { Router } from "express";
import {
  getFirearms,
  createFirearms,
  deleteFirearm,
} from "../handlers/firearms";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", verifyToken, getFirearms);
router.post("/", verifyToken, createFirearms);
router.delete("/:id", verifyToken, deleteFirearm);

export default router;
