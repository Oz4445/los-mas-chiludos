// src/routes/healthRoutes.js
import { Router } from "express";

const router = Router();

// Simple endpoint de salud
router.get("/", (req, res) => {
  res.send({ ok: true, status: "API online" });
});

export default router;
