import { useEffect, useMemo, useState } from "react";
import Section from "../../components/Section";
import {
  listTables,
  updateTable,
  listBookings,
  bookingCheckIn,
  bookingFinish,
  cancelBooking,
} from "../../data/api";

const STATUS = ["libre", "reservada", "ocupada", "limpieza"];

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  const load = async () => {
    const [mesasData, reservasData] = await Promise.all([
      listTables(),
      listBookings(),
    ]);
    setMesas(mesasData);
    setReservas(reservasData);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await updateTable(id, { status });
    setMesas((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const nextStatus = (cur) => {
    const i = STATUS.indexOf(cur);
    return STATUS[(i + 1) % STATUS.length];
  };

  const filtered = useMemo(() => {
    const base = mesas
      .slice()
      .sort((a, b) => (a.id || "").localeCompare(b.id || ""));
    if (filtro === "todas") return base;
    return base.filter((m) => m.status === filtro);
  }, [mesas, filtro]);

  const libresCount = mesas.filter((m) => m.status === "libre").length;
  const hoy = new Date().toISOString().slice(0, 10);

  const reservasPendientesHoy = useMemo(
    () =>
      reservas
        .filter(
          (r) =>
            r.fecha === hoy &&
            (r.estado === "pendiente" || r.estado === "confirmada")
        )
        .sort((a, b) => (a.hora || "").localeCompare(b.hora || "")),
    [reservas, hoy]
  );

  const asignarReserva = async (mesaId, resId) => {
    await Promise.all([
      bookingCheckIn(resId, mesaId),
      updateTable(mesaId, { status: "ocupada" }),
    ]);
    await load();
  };

  const ocuparSinReserva = async (mesaId) => {
    await updateTable(mesaId, { status: "ocupada" });
    await load();
  };

  const pasarALimpieza = async (mesaId) => {
    // si hubiera reserva en mesa ligada a esa mesa, la marcamos finalizada
    const enMesa = reservas.find(
      (r) => r.tableId === mesaId && r.estado === "en mesa"
    );
    if (enMesa) {
      await bookingFinish(enMesa.id);
    }
    await updateTable(mesaId, { status: "limpieza" });
    await load();
  };

  const liberar = async (mesaId) => {
    await updateTable(mesaId, { status: "libre" });
    await load();
  };

  const cancelarReservaMesa = async (mesaId) => {
    const vinculada = reservas.find(
      (r) =>
        r.tableId === mesaId &&
        (r.estado === "pendiente" || r.estado === "en mesa")
    );
    if (vinculada) {
      await cancelBooking(vinculada.id, true);
    }
    await updateTable(mesaId, { status: "libre" });
    await load();
  };

  const pillStyle = (s) => ({
    marginLeft: 10,
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background:
      s === "libre"
        ? "#e8f5e9"
        : s === "ocupada"
        ? "#e3f2fd"
        : s === "limpieza"
        ? "#fff3e0"
        : s === "reservada"
        ? "#ede7f6"
        : "#eee",
    border: "1px solid #ddd",
    color:
      s === "libre"
        ? "#2e7d32"
        : s === "ocupada"
        ? "#1565c0"
        : s === "limpieza"
        ? "#ef6c00"
        : s === "reservada"
        ? "#4527a0"
        : "#555",
  });

  return (
    <Section title="Mesas" subtitle={`Libres: ${libresCount} / ${mesas.length}`}>
      {/* Filtros */}
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
        <b>Filtrar:</b>
        {["todas", "libre", "reservada", "ocupada", "limpieza"].map((f) => (
          <button
            key={f}
            className={`btn ${filtro === f ? "" : "btn-outline"} chip`}
            onClick={() => setFiltro(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: "auto", opacity: 0.75 }}>
          Ocupadas: {mesas.filter((m) => m.status === "ocupada").length} ·
          Limpieza: {mesas.filter((m) => m.status === "limpieza").length}
        </div>
      </div>

      {/* Grid de mesas */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {filtered.map((m) => (
          <article key={m.id} className="card" style={{ padding: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 6px" }}>{m.name}</h3>
                <span style={{ opacity: 0.8 }}>Estado:</span>
                <span style={pillStyle(m.status)}>{m.status}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                {m.status === "libre" && (
                  <>
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value)
                          asignarReserva(m.id, e.target.value);
                      }}
                      style={{
                        padding: 8,
                        border: "1px solid #ddd",
                        borderRadius: 10,
                      }}
                      title={
                        reservasPendientesHoy.length
                          ? "Asignar reserva"
                          : "No hay reservas pendientes hoy"
                      }
                    >
                      <option value="" disabled>
                        {reservasPendientesHoy.length
                          ? "Asignar reserva…"
                          : "Sin reservas hoy"}
                      </option>
                      {reservasPendientesHoy.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.hora} · {r.nombreCliente} ({r.personas})
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn"
                      onClick={() => ocuparSinReserva(m.id)}
                    >
                      Ocupar sin reserva
                    </button>
                  </>
                )}

                {m.status === "ocupada" && (
                  <button
                    className="btn"
                    onClick={() => pasarALimpieza(m.id)}
                  >
                    Pasar a limpieza
                  </button>
                )}

                {m.status === "limpieza" && (
                  <button className="btn" onClick={() => liberar(m.id)}>
                    Liberar
                  </button>
                )}

                {m.status === "reservada" && (
                  <>
                    <button
                      className="btn btn-outline"
                      onClick={() => cancelarReservaMesa(m.id)}
                    >
                      Cancelar reserva
                    </button>
                    <button
                      className="btn"
                      onClick={() => setStatus(m.id, "ocupada")}
                    >
                      Check-in (ocupar)
                    </button>
                  </>
                )}

                <button
                  className="btn btn-outline"
                  onClick={() => setStatus(m.id, nextStatus(m.status))}
                >
                  Siguiente estado
                </button>
              </div>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className="card" style={{ padding: 18 }}>
            Sin mesas para este filtro.
          </div>
        )}
      </div>
    </Section>
  );
}
