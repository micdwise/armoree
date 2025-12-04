import { Router } from "express";
import {
  getFirearms,
  createFirearms,
  deleteFirearm,
} from "../handlers/firearms";

const router = Router();

router.get("/", getFirearms);
router.post("/", createFirearms);
router.delete("/:id", deleteFirearm);

export default router;
