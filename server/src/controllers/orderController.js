import { db } from "../firebaseAdmin.js";

export const crearPedido = async (req, res) => {
  try {
    const { cliente, items, total } = req.body;

    if (!cliente || !Array.isArray(items) || items.length === 0 || !total || total <= 0) {
      return res.status(400).send({
        error: "Datos del pedido inválidos. Incluye cliente, items y total válido.",
      });
    }

    const pedido = {
      cliente,
      items,
      total,
      estado: "recibido",
      creado: new Date(),
    };

    const docRef = await db.collection("orders").add(pedido);
    res.status(201).send({ id: docRef.id, mensaje: "Pedido creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear pedido");
  }
};

export const listarPedidos = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();
    const pedidos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al listar pedidos");
  }
};
