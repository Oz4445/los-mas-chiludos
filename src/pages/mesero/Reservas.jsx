import { useEffect, useMemo, useState } from "react";
import Section from "../../components/Section";
import { listBookings } from "../../data/api";

const pill = (s) => ({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  marginLeft: 8,
  background:
    s === "confirmada"
      ? "#e8f5e9"
      : s === "pendiente"
      ? "#e3f2fd"
      : s === "en mesa"
      ? "#fff3e0"
      : s === "cancelada"
      ? "#ffebee"
      : "#eee",
  color:
    s === "confirmada"
      ? "#2e7d32"
      : s === "pendiente"
      ? "#1565c0"
      : s === "en mesa"
      ? "#ef6c00"
      : s === "cancelada"
      ? "#c62828"
      : "#555",
  border: "1px solid #ddd",
});

export default function ReservasMesero() {
  const [reservas, setReservas] = useState([]);

  const load = async () => {
    const data = await listBookings();
    setReservas(data);
  };

  useEffect(() => {
    load();
  }, []);

  const list = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10);

    return reservas
      .filter(
        (r) =>
          r.fecha === hoy &&
          (r.estado === "pendiente" ||
            r.estado === "confirmada" ||
            r.estado === "en mesa")
      )
      .sort((a, b) => {
        const fa = `${a.fecha || ""}${a.hora || ""}`;
        const fb = `${b.fecha || ""}${b.hora || ""}`;
        return fa.localeCompare(fb);
      });
  }, [reservas]);

  return (
    <Section
      title="Reservas (Mesero)"
      subtitle="Pendientes, confirmadas y en mesa"
    >
      <div className="grid">
        {list.map((r) => (
          <article key={r.id} className="card" style={{ padding: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <strong>{r.hora}</strong>
                <span style={{ marginLeft: 10 }}>
                  {r.nombreCliente} · {r.telefono || "Sin teléfono"}
                </span>
                <span style={pill(r.estado)}>{r.estado}</span>
                {r.tableId && (
                  <span style={{ marginLeft: 8, opacity: 0.8 }}>
                    · {r.tableId}
                  </span>
                )}
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 14, opacity: 0.85 }}>
              <div>Personas: {r.personas}</div>
              {r.notas && <div>Notas: {r.notas}</div>}
            </div>
          </article>
        ))}

        {!list.length && (
          <div className="card" style={{ padding: 18 }}>
            No hay reservas activas para hoy.
          </div>
        )}
      </div>
    </Section>
  );
}
