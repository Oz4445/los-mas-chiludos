// src/index.js
import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";   // 👈 nombre correcto del archivo
import bookingRoutes from "./routes/bookingRoutes.js";
import tablesRoutes from "./routes/tablesRoutes.js"; // 👈 nuevo
import healthRoutes from "./routes/healthRoutes.js"; // 👈 lo vamos a crear

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/health", healthRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/bookings", bookingRoutes);
app.use("/tables", tablesRoutes);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`🔥 API corriendo en http://localhost:${PORT}`);
});

export default app;
