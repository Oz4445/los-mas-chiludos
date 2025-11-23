import { Router } from "express";
import { db } from "../../firebaseAdmin.js";

const router = Router();

/**
 * GET /tables
 * Lista todas las mesas
 */
router.get("/", async (req, res) => {
  try {
    const snap = await db.collection("tables").get();
    const mesas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.send(mesas);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al listar mesas.");
  }
});

/**
 * PATCH /tables/:id
 * Actualiza campos de una mesa (status, name, capacity, etc.)
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body || {};

    const ref = db.collection("tables").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).send("Mesa no encontrada.");
    }

    await ref.update({
      ...data,
      actualizadaEn: new Date(),
    });

    res.send({ ok: true, msg: "Mesa actualizada correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar mesa.");
  }
});

export default router;
