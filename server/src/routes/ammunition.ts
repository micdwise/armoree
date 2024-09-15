import { Router } from "express";
import { createAmmunition, getAmmunition } from "../handlers/ammunition";

const router = Router();

router.use ((req, res, next) => {
  next();
});

router.get("/", getAmmunition);
router.post("/", createAmmunition);

export default router;