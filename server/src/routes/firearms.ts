import { Router } from "express";
import { getFirearms, createFirearms } from "../handlers/firearms";

const router = Router();

router.get("/", getFirearms);
router.post("/", createFirearms);

export default router;