import { storage } from "./seed"; // compat, ya casi no se usa

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function req(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status}`);
  }

  return res.json().catch(() => ({}));
}

/* ================= MENÚ ================= */

function normalizeMenu(raw) {
  return {
    id: raw.id,
    nombre: raw.nombre,
    precio: raw.precio,
    categoria: raw.categoria,
    descripcion: raw.descripcion || "",
    imagen: raw.imagen || "",
    activo: raw.activo ?? true,
  };
}

export const getMenu = async () => {
  const data = await req("/menu");
  return data.map(normalizeMenu);
};

export const addMenuItem = (body) =>
  req("/menu", { method: "POST", body: JSON.stringify(body) });

export const updateMenuItem = (id, body) =>
  req(`/menu/${id}`, { method: "PATCH", body: JSON.stringify(body) });

export const deleteMenuItem = (id) =>
  req(`/menu/${id}`, { method: "DELETE" });

/* ================= ÓRDENES ================= */

function normalizeOrder(raw) {
  const id = raw.id || crypto.randomUUID().slice(0, 8);
  const estado = raw.estado || raw.status || "recibido";

  // 🔥 Normalizar fecha de Firestore
  let createdAt = raw.createdAt;
  if (createdAt?._seconds) {
    // cuando viene de Admin SDK como {_seconds, _nanoseconds}
    createdAt = new Date(createdAt._seconds * 1000).toISOString();
  } else if (createdAt?.seconds) {
    // cuando viene como {seconds, nanoseconds}
    createdAt = new Date(createdAt.seconds * 1000).toISOString();
  } else if (typeof createdAt === "string") {
    // ya viene como ISO string
    createdAt = createdAt;
  } else {
    createdAt = new Date().toISOString();
  }

  // 🔥 Normalizar items para que SIEMPRE tengan name / qty / price
  const items = (raw.items || []).map((i) => ({
    name: i.name ?? i.nombre ?? "",
    qty: i.qty ?? i.cantidad ?? 0,
    price: i.price ?? i.precio ?? 0,
  }));

  // Si por alguna razón total no viene, lo calculamos
  const totalNormalizado =
    typeof raw.total === "number"
      ? raw.total
      : items.reduce(
          (acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0),
          0
        );

  return {
    id,
    cliente: raw.cliente,
    total: totalNormalizado,
    estado,
    status: estado, // compat frontend mesero/admin
    items,
    userId: raw.userId || null,
    createdAt,
  };
}

export const createOrder = (body) =>
  req("/orders", { method: "POST", body: JSON.stringify(body) });

export const listOrders = async (userId = null) => {
  const url = userId ? `/orders?userId=${userId}` : "/orders";
  const data = await req(url);
  return data.map(normalizeOrder);
};

export const updateOrder = (id, estado) =>
  req(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });

/* ================= RESERVAS ================= */

function normalizeBooking(raw) {
  const id = raw.id || crypto.randomUUID().slice(0, 8);

  let fecha = raw.fecha || "";
  if (fecha) {
    fecha = new Date(fecha).toISOString().slice(0, 10);
  }

  return {
    id,
    nombreCliente: raw.nombreCliente,
    fecha,
    hora: raw.hora || "",
    personas: raw.personas,
    telefono: raw.telefono || "",
    notas: raw.notas || "",
    estado: raw.estado || "pendiente",
    tipo: raw.tipo || "mesa",
    userId: raw.userId || null,
    tableId: raw.tableId || null,

    // Compatibilidad mesero
    date: fecha,
    time: raw.hora,
    people: raw.personas,
    phone: raw.telefono,
    status: raw.estado,
  };
}

export const createBooking = (body) =>
  req("/bookings", { method: "POST", body: JSON.stringify(body) });

export const listBookings = async (userId = null) => {
  const url = userId ? `/bookings?userId=${userId}` : "/bookings";
  const data = await req(url);
  return data.map(normalizeBooking);
};

export const cancelBooking = (id, fuerzaMayor = false) =>
  req(`/bookings/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ fuerzaMayor }),
  });

export const confirmBooking = (id) =>
  req(`/bookings/${id}/confirm`, { method: "PATCH" });

export const rejectBooking = (id) =>
  req(`/bookings/${id}/reject`, { method: "PATCH" });

export const deleteBooking = (id) =>
  req(`/bookings/${id}`, { method: "DELETE" });

// Mesero extras
export const bookingCheckIn = (id, tableId) =>
  req(`/bookings/${id}/checkin`, {
    method: "PATCH",
    body: JSON.stringify({ tableId }),
  });

export const bookingFinish = (id) =>
  req(`/bookings/${id}/finish`, { method: "PATCH" });

/* ================= MESAS ================= */

function normalizeTable(raw) {
  return {
    id: raw.id,
    name: raw.name,
    status: raw.status || "libre",
    capacity: raw.capacity || 4,
  };
}

export const listTables = async () => {
  const data = await req("/tables");
  return data.map(normalizeTable);
};

export const updateTable = (id, body) =>
  req(`/tables/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
