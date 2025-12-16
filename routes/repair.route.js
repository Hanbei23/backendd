import { Router } from "express";
import {
  createRepair,
  updateRepair,
  getAllRepair,
  getLatestRepair,
  getRepairById,
  deleteAllRepair,
  deleteRepairById, // ⬅️ TAMBAH
} from "../controller/repair.controller.js";

const router = Router();

// CREATE
router.post("/create", createRepair);

// UPDATE
router.put("/update/:id", updateRepair);

// GET ALL
router.get("/all", getAllRepair);

// GET LATEST
router.get("/latest", getLatestRepair);

// GET BY ID
router.get("/:id", getRepairById);

// DELETE ONE 🔥
router.delete("/delete/:id", deleteRepairById);

// DELETE ALL (ADMIN ONLY)
router.delete("/delete-all", deleteAllRepair);

export default router;
