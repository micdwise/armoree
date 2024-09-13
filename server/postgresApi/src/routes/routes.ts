import { Router } from "express";
import { getFirearms, createFirearms } from "../firearms/controller";
import { createAmmunition, getAmmunition } from "../ammunition/controller";

const router = Router();

router.get("/", getAmmunition);
router.post("/", createAmmunition);
router.get("/", getFirearms);
router.post("/", createFirearms);

export default router;