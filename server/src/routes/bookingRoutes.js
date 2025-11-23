import { Router } from "express";
import { db } from "../../firebaseAdmin.js";

const router = Router();

/**
 * POST /bookings
 */
router.post("/", async (req, res) => {
  try {
    const { nombreCliente, fecha, hora, personas, telefono, userId, tipo } =
      req.body;

    if (
      !nombreCliente ||
      !fecha ||
      !hora ||
      !personas ||
      personas <= 0 ||
      !userId ||
      !tipo
    ) {
      return res.status(400).send({
        error:
          "Faltan datos: nombreCliente, fecha, hora, personas>0, userId y tipo son obligatorios.",
      });
    }

    const reserva = {
      nombreCliente,
      fecha, // "2025-11-23"
      hora,  // "12:00"
      personas,
      telefono: telefono || "Sin número",
      userId,
      tipo, // mesa | alimentos
      estado: "pendiente",
      creada: new Date(),
    };

    const docRef = await db.collection("bookings").add(reserva);
    res.status(201).send({ id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear reserva.");
  }
});

/**
 * GET /bookings
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    let snap;

    if (userId) {
      snap = await db.collection("bookings").where("userId", "==", userId).get();
    } else {
      snap = await db.collection("bookings").get();
    }

    const reservas = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    res.send(reservas);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al listar reservas.");
  }
});

/**
 * PATCH /bookings/:id/confirm
 */
router.patch("/:id/confirm", async (req, res) => {
  try {
    const { id } = req.params;

    const ref = db.collection("bookings").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).send("Reservación no encontrada");
    }

    await ref.update({
      estado: "confirmada",
      confirmadaEn: new Date(),
    });

    res.send({ ok: true, msg: "Reservación confirmada exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al confirmar reservación.");
  }
});

/**
 * PATCH /bookings/:id/reject
 */
router.patch("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const ref = db.collection("bookings").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).send("Reservación no encontrada");
    }

    await ref.update({
      estado: "rechazada",
      rechazadaEn: new Date(),
    });

    res.send({ ok: true, msg: "Reservación rechazada correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al rechazar reservación.");
  }
});

/**
 * PATCH /bookings/:id/cancel
 * (cliente o admin / mesero)
 */
router.patch("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const { fuerzaMayor = false } = req.body;

    const ref = db.collection("bookings").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).send("Reservación no encontrada.");
    }

    const r = snap.data();

    if (r.estado === "cancelada") {
      return res.status(400).send("La reservación ya estaba cancelada.");
    }

    const fechaHora = new Date(`${r.fecha}T${r.hora}:00`);
    const ahora = new Date();
    const minutosRestantes = (fechaHora - ahora) / (1000 * 60);

    if (!fuerzaMayor) {
      if (r.tipo === "mesa" && minutosRestantes < 30) {
        return res
          .status(400)
          .send("No es posible cancelar: debes hacerlo 30 minutos antes.");
      }

      if (r.tipo === "alimentos" && minutosRestantes < 60) {
        return res
          .status(400)
          .send("No es posible cancelar: debes hacerlo 1 hora antes.");
      }
    }

    await ref.update({
      estado: "cancelada",
      canceladaEn: new Date(),
      tableId: null,
    });

    res.send({ ok: true, msg: "Reservación cancelada correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cancelar reservación.");
  }
});

/**
 * PATCH /bookings/:id/checkin
 * Mesero asigna mesa y pasa a "en mesa"
 */
router.patch("/:id/checkin", async (req, res) => {
  try {
    const { id } = req.params;
    const { tableId } = req.body;

    if (!tableId) {
      return res.status(400).send("Falta tableId.");
    }

    const ref = db.collection("bookings").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).send("Reservación no encontrada.");
    }

    await ref.update({
      estado: "en mesa",
      tableId,
      checkinEn: new Date(),
    });

    res.send({ ok: true, msg: "Reserva marcada como 'en mesa'." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al hacer check-in.");
  }
});

/**
 * PATCH /bookings/:id/finish
 * Cuando el cliente se va, la reserva se marca como finalizada
 */
router.patch("/:id/finish", async (req, res) => {
  try {
    const { id } = req.params;

    const ref = db.collection("bookings").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).send("Reservación no encontrada.");
    }

    await ref.update({
      estado: "finalizada",
      finalizadaEn: new Date(),
    });

    res.send({ ok: true, msg: "Reservación finalizada." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al finalizar reservación.");
  }
});

/**
 * DELETE /bookings/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("bookings").doc(id).delete();

    res.send({ ok: true, msg: "Reservación eliminada correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar la reservación.");
  }
});

export default router;
