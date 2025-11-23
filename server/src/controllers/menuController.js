import { db } from "../firebaseAdmin.js";

export const crearPlatillo = async (req, res) => {
  try {
    const { nombre, precio, categoria } = req.body;
    if (!nombre || !precio || !categoria) {
      return res.status(400).send({ error: "Faltan datos del platillo." });
    }

    const docRef = await db.collection("menu").add({
      nombre,
      precio,
      categoria,
      creado: new Date(),
    });

    res.status(201).send({ id: docRef.id, mensaje: "Platillo agregado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar platillo.");
  }
};

export const listarPlatillos = async (req, res) => {
  try {
    const snapshot = await db.collection("menu").get();
    const platillos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(platillos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al listar el menú.");
  }
};
