// src/pages/admin/ReservasAdmin.jsx
import { useEffect, useState } from "react";
import Section from "../../components/Section";
import {
  listBookings,
  cancelBooking,
  confirmBooking,
  rejectBooking,
  deleteBooking,
} from "../../data/api";
import "../../styles/adminlists.css";

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);

  const load = async () => {
    const data = await listBookings(); // Admin recibe TODAS
    setReservas(data);
  };

  useEffect(() => {
    load();
  }, []);

  /* === ACCIONES === */

  const confirmar = async (r) => {
    if (!confirm(`¿Confirmar la reservación de ${r.nombreCliente}?`)) return;

    try {
      await confirmBooking(r.id);
      alert("Reservación confirmada correctamente.");
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const rechazar = async (r) => {
    if (!confirm(`¿Rechazar la reservación de ${r.nombreCliente}?`)) return;

    try {
      await rejectBooking(r.id);
      alert("Reservación rechazada.");
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelarFuerzaMayor = async (r) => {
    if (!confirm(`¿Cancelar por fuerza mayor la reservación de ${r.nombreCliente}?`)) return;

    try {
      await cancelBooking(r.id, true);
      alert("Reservación cancelada por fuerza mayor.");
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const eliminar = async (r) => {
    if (!confirm(`¿Eliminar la reservación de ${r.nombreCliente}?`)) return;

    try {
      await deleteBooking(r.id);
      alert("Reservación eliminada.");
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  /* === FILTRAR SOLO LAS IMPORTANTES === */
  const activas = reservas.filter(
    (r) =>
      r.estado === "pendiente" ||
      r.estado === "confirmada" ||
      r.estado === "rechazada" ||
      r.estado === "en mesa"
  );

  return (
    <Section title="Reservas (Admin)" subtitle="Consulta y gestiona las reservaciones">
      <div className="reservas-grid">
        {activas.map((r) => (
          <article key={r.id} className="card reserva-card">
            <div className="reserva-header">
              <div>
                <h3 className="reserva-nombre">{r.nombreCliente}</h3>
                <p className="reserva-info">
                  {r.fecha} — {r.hora} · {r.personas} personas
                </p>
              </div>

              <span className={`estado-pill estado-${(r.estado || "pendiente").toLowerCase()}`}>
                {r.estado}
              </span>
            </div>

            <div className="reserva-body">
              {r.telefono && (
                <p>
                  <b>Teléfono:</b> {r.telefono}
                </p>
              )}
              <p>
                <b>Tipo:</b> {r.tipo === "alimentos" ? "Mesa con alimentos" : "Solo mesa"}
              </p>

              {/* ACCIONES */}
              <div className="reserva-acciones">
                {r.estado === "pendiente" && (
                  <>
                    <button className="btn" onClick={() => confirmar(r)}>
                      Confirmar
                    </button>

                    <button className="btn btn-outline" onClick={() => rechazar(r)}>
                      Rechazar
                    </button>
                  </>
                )}

                {/* Cancelación por fuerza mayor (siempre disponible) */}
                {r.estado !== "cancelada" && (
                  <button className="btn btn-outline" onClick={() => cancelarFuerzaMayor(r)}>
                    Cancelar (fuerza mayor)
                  </button>
                )}

                {/* Eliminar */}
                <button className="btn btn-danger" onClick={() => eliminar(r)}>
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}

        {!activas.length && (
          <div className="card" style={{ padding: 18, textAlign: "center" }}>
            No hay reservaciones activas 😢
          </div>
        )}
      </div>
    </Section>
  );
}
