import { Router } from "express";
import { getFirearms, postFirearms } from "./controller";

const router = Router();

router.get("/", getFirearms);
router.post("/", postFirearms);

export default router;