// src/pages/admin/OrdenesAdmin.jsx
import { useEffect, useState } from "react";
import Section from "../../components/Section";
import { listOrders, updateOrder } from "../../data/api";
import "../../styles/adminlists.css";

export default function OrdenesAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listOrders(); 
        setOrdenes(data);
      } catch (e) {
        alert("Error al cargar órdenes: " + e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cambiarEstado = async (id, estadoNuevo) => {
    try {
      await updateOrder(id, estadoNuevo);
      setOrdenes((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado: estadoNuevo } : o))
      );
    } catch (e) {
      alert("Error al actualizar pedido: " + e.message);
    }
  };

  if (loading) {
    return (
      <Section title="Órdenes">
        <p style={{ textAlign: "center" }}>Cargando órdenes...</p>
      </Section>
    );
  }

  return (
    <Section title="Órdenes (Admin)" subtitle="Gestión de pedidos y su estado">
      <div className="reservas-grid">
        {ordenes.map((o) => (
          <article key={o.id} className="card reserva-card">
            <div className="reserva-header">
              <div>
                <h3 className="reserva-nombre">{o.cliente}</h3>
                <p className="reserva-info">Total: ${o.total}</p>
              </div>
              <span className={`estado-pill estado-${o.estado?.toLowerCase()}`}>
                {o.estado}
              </span>
            </div>

            <div className="reserva-body">
              {(o.items || []).map((i, ix) => {
                const qty = i.qty ?? i.cantidad;
                const name = i.name ?? i.nombre;
                const price = i.price ?? i.precio;

                return (
                  <li key={ix}>
                    {qty}× {name} — ${price}
                  </li>
                );
              })}
            </div>

            <div className="reserva-footer">
              {o.estado === "recibido" && (
                <>
                  <button className="btn btn-outline" onClick={() => cambiarEstado(o.id, "en preparación")}>
                    Preparar
                  </button>
                  <button className="btn btn-outline" onClick={() => cambiarEstado(o.id, "cancelada")}>
                    Cancelar
                  </button>
                </>
              )}

              {o.estado === "en preparación" && (
                <button className="btn" onClick={() => cambiarEstado(o.id, "lista")}>
                  Marcar como lista
                </button>
              )}

              {o.estado === "lista" && (
                <button className="btn btn-outline" onClick={() => cambiarEstado(o.id, "entregada")}>
                  Entregar
                </button>
              )}

              {o.estado === "cancelada" && (
                <button className="btn btn-outline" onClick={() => cambiarEstado(o.id, "recibido")}>
                  Reactivar
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
