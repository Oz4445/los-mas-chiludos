import { Router } from "express";
import { db } from "../../firebaseAdmin.js"; // ← corregido: quitamos deleteImageFromStorage

const router = Router();

/* ============================================================
   POST /menu → Crear platillo
   ============================================================ */
router.post("/", async (req, res) => {
  try {
    const { nombre, precio, categoria, descripcion, imagen } = req.body;

    if (!nombre || precio == null || !categoria) {
      return res
        .status(400)
        .send({ error: "Faltan nombre, precio o categoría" });
    }

    const doc = await db.collection("menu").add({
      nombre,
      precio,
      categoria,
      descripcion: descripcion || "",
      imagen: imagen || "",
      activo: true,
      creado: new Date(),
    });

    res.status(201).send({ id: doc.id });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error al crear platillo.");
  }
});

/* ============================================================
   GET /menu → obtener todos
   ============================================================ */
router.get("/", async (_req, res) => {
  try {
    const snap = await db.collection("menu").orderBy("creado", "desc").get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.send(data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error al obtener menú.");
  }
});

/* ============================================================
   PATCH /menu/:id → editar o activar/desactivar
   ============================================================ */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("menu").doc(id).update(req.body);
    res.send({ id, ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error al actualizar platillo.");
  }
});

/* ============================================================
   DELETE /menu/:id  → 🔥 Eliminar platillo (solo Firestore por ahora)
   ============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection("menu").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).send("Platillo no encontrado");
    }

    const data = snap.data();

    // ⚠️ Antes eliminábamos la imagen. Eso ya no existe.
    // Ahora solo dejamos un aviso para no romper nada.
    if (data.imagen) {
      console.log("⚠️ Imagen pendiente por eliminar manualmente:", data.imagen);
    }

    // Eliminar documento Firestore
    await docRef.delete();

    res.send({ id, deleted: true });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error al eliminar platillo.");
  }
});

export default router;
