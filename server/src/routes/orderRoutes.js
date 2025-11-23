import { Router } from "express";
import { db } from "../../firebaseAdmin.js";

const router = Router();

/* ============================================================
   POST /orders - Crear pedido
   ============================================================ */
router.post("/", async (req, res) => {
  try {
    const { cliente, items, total, userId } = req.body;

    if (!cliente || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).send({
        error: "Datos inválidos: cliente, items[] y total son obligatorios."
      });
    }

    const pedido = {
      cliente,
      items,
      total,
      userId: userId || null,
      estado: "recibido",
      createdAt: new Date(), // Firestore Timestamp
    };

    const docRef = await db.collection("orders").add(pedido);
    res.status(201).send({ id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear pedido.");
  }
});

/* ============================================================
   GET /orders  → listar pedidos
   ============================================================ */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    let ref = db.collection("orders");

    if (userId) {
      ref = ref.where("userId", "==", userId);
    } else {
      // Ordenamos por fecha si es admin
      ref = ref.orderBy("createdAt", "desc");
    }

    const snap = await ref.get();
    const lista = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    res.send(lista);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al listar pedidos.");
  }
});

/* ============================================================
   PATCH /orders/:id → actualizar ESTADO
   ============================================================ */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).send({ error: "El campo 'estado' es obligatorio." });
    }

    await db.collection("orders").doc(id).update({ estado });

    res.send({ id, estado });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar pedido.");
  }
});

export default router;
