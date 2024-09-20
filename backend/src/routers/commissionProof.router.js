import Router from "express";
import { calculateComission } from "../controllers/commissionProof.controller.js";
const router = Router();

router.post("/calculate-comission", calculateComission);

export default router;
