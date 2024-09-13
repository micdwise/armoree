import { Router } from "express";
import { createAmmunition, getAmmunition } from "../handlers/ammunition";

const router = Router();

router.get("/", getAmmunition);
router.post("/", createAmmunition);

export default router;