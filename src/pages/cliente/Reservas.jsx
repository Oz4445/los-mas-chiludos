// src/pages/cliente/Reservas.jsx
import { useState } from "react";
import { createBooking } from "../../data/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/forms.css";

export default function Reservas() {
  const { user } = useAuth(); // 👈 Usuario logueado

  const [form, setForm] = useState({
    nombreCliente: "",
    fecha: "",
    hora: "",
    personas: 2,
    telefono: "",
    tipo: "mesa", // ⭐ AGREGADO — requerido por el backend
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!user) {
      setMsg("❌ Debes iniciar sesión para reservar.");
      return;
    }

    if (!form.nombreCliente || !form.fecha || !form.hora || form.personas <= 0) {
      setMsg("⚠️ Completa nombre, fecha, hora y personas válidas.");
      return;
    }

    setLoading(true);
    try {
      // ⭐ CORREGIDO: enviar userId y tipo (backend los requiere)
      const payload = {
        ...form,
        userId: user.uid,
      };

      const resp = await createBooking(payload);

      setMsg(`✅ Reserva creada correctamente. ID: ${resp.id}`);

      // Limpiar el form
      setForm({
        nombreCliente: "",
        fecha: "",
        hora: "",
        personas: 2,
        telefono: "",
        tipo: "mesa",
      });
    } catch (err) {
      setMsg("❌ Error al crear reserva: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Reservación</h1>
        <p className="form-subtitle">Ingresa los datos para tu reserva 🌶️</p>

        <form onSubmit={submit} className="form-body">
          <label>Nombre del cliente</label>
          <input
            type="text"
            placeholder="Ej. Juan Pérez"
            value={form.nombreCliente}
            onChange={(e) => set("nombreCliente", e.target.value)}
          />

          <div className="form-row">
            <div>
              <label>Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => set("fecha", e.target.value)}
              />
            </div>
            <div>
              <label>Hora</label>
              <input
                type="time"
                value={form.hora}
                onChange={(e) => set("hora", e.target.value)}
              />
            </div>
          </div>

          <label>Personas</label>
          <input
            type="number"
            min={1}
            value={form.personas}
            onChange={(e) => set("personas", Number(e.target.value))}
          />

          <label>Teléfono (opcional)</label>
          <input
            placeholder="Ej. 222-123-4567"
            value={form.telefono}
            onChange={(e) => set("telefono", e.target.value)}
          />

          {/* CAMPO TIPO (puede ocultarse si no quieres mostrarlo) */}
          <input type="hidden" value={form.tipo} />

          {msg && <div className="form-msg">{msg}</div>}

          <button disabled={loading} className="btn">
            {loading ? "Enviando..." : "Reservar"}
          </button>
        </form>
      </div>
    </div>
  );
}
