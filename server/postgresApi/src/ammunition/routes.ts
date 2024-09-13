import { Router } from "express";
import { getAmmunition, createAmmunition} from "./controller"

const router = Router();
  
router.get("/", getAmmunition);
router.post("/", createAmmunition);

export default router;