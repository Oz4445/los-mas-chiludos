import { useEffect, useMemo, useState } from "react";
import Section from "../../components/Section";
import { listOrders, updateOrder } from "../../data/api";

const ESTADOS = ["recibido", "en preparación", "lista", "entregada", "cancelada"];

const pill = (s) => ({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  marginLeft: 8,
  background:
    s === "lista"
      ? "#e8f5e9"
      : s === "en preparación"
      ? "#e3f2fd"
      : s === "recibido"
      ? "#fff3e0"
      : s === "entregada"
      ? "#ede7f6"
      : s === "cancelada"
      ? "#ffebee"
      : "#eee",
  color:
    s === "lista"
      ? "#2e7d32"
      : s === "en preparación"
      ? "#1565c0"
      : s === "recibido"
      ? "#ef6c00"
      : s === "entregada"
      ? "#4527a0"
      : s === "cancelada"
      ? "#c62828"
      : "#555",
  border: "1px solid #ddd",
});

export default function OrdenesMesero() {
  const [ordenes, setOrdenes] = useState([]);
  const [tab, setTab] = useState("activas");
  const [open, setOpen] = useState({});

  const load = async () => {
    try {
      const data = await listOrders();
      setOrdenes(data);
    } catch (err) {
      console.error(err);
      alert("Error cargando órdenes: " + err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await updateOrder(id, status);
    load();
  };

  const visibles = useMemo(() => {
    if (tab === "todas") return ordenes;

    if (tab === "activas") {
      return ordenes.filter((o) =>
        ["recibido", "en preparación", "lista"].includes(o.status)
      );
    }

    return ordenes.filter((o) => o.status === tab);
  }, [ordenes, tab]);

  const actions = (o) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {o.status === "recibido" && (
        <button className="btn" onClick={() => setStatus(o.id, "en preparación")}>
          Preparar
        </button>
      )}
      {o.status === "en preparación" && (
        <button className="btn" onClick={() => setStatus(o.id, "lista")}>
          Marcar listo
        </button>
      )}
      {o.status === "lista" && (
        <button className="btn" onClick={() => setStatus(o.id, "entregada")}>
          Entregar
        </button>
      )}
      {o.status !== "entregada" && o.status !== "cancelada" && (
        <button className="btn btn-outline" onClick={() => setStatus(o.id, "cancelada")}>
          Cancelar
        </button>
      )}
      <button
        className="btn btn-outline"
        onClick={() => setOpen((s) => ({ ...s, [o.id]: !s[o.id] }))}
      >
        {open[o.id] ? "Ocultar" : "Ver"} items
      </button>
    </div>
  );

  return (
    <Section title="Órdenes en sala" subtitle="Gestiona estados del pedido">
      <div
        className="card"
        style={{
          padding: 12,
          marginBottom: 16,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {["activas", "todas", ...ESTADOS].map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? "" : "btn-outline"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}

        <span style={{ opacity: 0.7, marginLeft: 8 }}>
          Activas:{" "}
          {ordenes.filter((o) =>
            ["recibido", "en preparación", "lista"].includes(o.status)
          ).length}
        </span>
      </div>

      <div className="grid">
        {visibles.map((o) => (
          <article key={o.id} className="card" style={{ padding: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <strong>{o.cliente}</strong>

                <span style={{ marginLeft: 10, opacity: 0.75, fontSize: 13 }}>
                  {o.createdAt &&
                    new Date(o.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>

                <span style={pill(o.status)}>{o.status}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <strong>${o.total ?? 0}</strong>
                {actions(o)}
              </div>
            </div>

            {open[o.id] && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Items</div>

                {(o.items || []).map((it, ix) => (
                  <div
                    key={ix}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div>
                      {it.name} × {it.qty}{" "}
                      <span style={{ opacity: 0.6 }}>@ ${it.price}</span>
                    </div>
                    <div>${it.price * it.qty}</div>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}

        {!visibles.length && (
          <div className="card" style={{ padding: 18 }}>
            No hay órdenes para mostrar.
          </div>
        )}
      </div>
    </Section>
  );
}
