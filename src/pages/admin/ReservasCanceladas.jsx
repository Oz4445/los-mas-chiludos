import { useEffect, useState } from "react";
import Section from "../../components/Section";
import { storage } from "../../data/seed";
import "../../styles/adminlists.css";

export default function ReservasCanceladas() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const load = () =>
      setReservas(
        (storage.get("reservations") || []).filter(
          (r) => r.estado === "cancelada"
        )
      );

    load();
    const h = () => load();
    window.addEventListener("data:changed", h);
    return () => window.removeEventListener("data:changed", h);
  }, []);

  return (
    <Section
      title="Reservas canceladas"
      subtitle="Historial de reservas que fueron canceladas permanentemente"
    >
      {/* 🔥 TABS DE NAVEGACIÓN */}
      <div className="tabs-admin">
        <a href="/admin/reservas" className="tab-btn inactive">
          Activas
        </a>
        <span className="tab-btn active">Canceladas</span>
      </div>

      <div className="reservas-grid">
        {reservas.map((r) => (
          <article key={r.id} className="card reserva-card">
            <div className="reserva-header">
              <div>
                <h3 className="reserva-nombre">{r.nombreCliente}</h3>
                <p className="reserva-info">
                  {r.fecha} — {r.hora}
                </p>
              </div>
              <span className="estado-pill estado-cancelada">Cancelada</span>
            </div>

            <div className="reserva-body">
              <p><b>Personas:</b> {r.personas}</p>
              {r.telefono && <p><b>Teléfono:</b> {r.telefono}</p>}
              {r.notas && <p><b>Notas:</b> {r.notas}</p>}
            </div>
          </article>
        ))}

        {!reservas.length && (
          <div className="card" style={{ padding: 18, textAlign: "center" }}>
            No hay reservaciones canceladas.
          </div>
        )}
      </div>
    </Section>
  );
}
