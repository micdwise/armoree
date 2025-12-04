import { Router } from "express";
import {
  createAmmunition,
  getAmmunition,
  deleteAmmunition,
} from "../handlers/ammunition";

const router = Router();

router.use((req, res, next) => {
  next();
});

router.get("/", getAmmunition);
router.post("/", createAmmunition);
router.delete("/:id", deleteAmmunition);

export default router;
