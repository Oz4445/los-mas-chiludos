import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import tablesRoutes from "./routes/tablesRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Permitir JSON
app.use(cors());
app.use(express.json());

// Rutas
app.use("/health", healthRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/bookings", bookingRoutes);
app.use("/tables", tablesRoutes);

// 🔥 IMPORTANTE PARA DEPLOY EN RAILWAY 🔥
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 API corriendo en http://0.0.0.0:${PORT}`);
});

export default app;
