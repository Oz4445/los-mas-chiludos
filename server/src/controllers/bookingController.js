import { db } from "../firebaseAdmin.js";

export const crearReserva = async (req, res) => {
  try {
    const { nombreCliente, fecha, hora, personas, telefono } = req.body;

    if (!nombreCliente || !fecha || !hora || !personas || personas <= 0) {
      return res.status(400).send({
        error: "Datos inválidos. Incluye nombreCliente, fecha, hora y personas > 0.",
      });
    }

    const reserva = {
      nombreCliente,
      fecha,
      hora,
      personas,
      telefono: telefono || "Sin número",
      estado: "pendiente",
      creada: new Date(),
    };

    const docRef = await db.collection("bookings").add(reserva);
    res.status(201).send({ id: docRef.id, mensaje: "Reserva creada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear reserva");
  }
};

export const listarReservas = async (req, res) => {
  try {
    const snapshot = await db.collection("bookings").get();
    const reservas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al listar reservas");
  }
};
