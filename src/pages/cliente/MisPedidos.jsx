// src/pages/cliente/MisPedidos.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Section from "../../components/Section";
import { useAuth } from "../../context/AuthContext";
import { listOrders } from "../../data/api";
import "../../styles/mislistas.css";

export default function MisPedidos() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const data = await listOrders(user.uid);
      setOrders(data);
    };

    load();
  }, [user]);

  if (!user) {
    return (
      <Section title="Mis pedidos">
        <div className="card" style={{ padding: 18 }}>
          <p>Inicia sesión para ver tus pedidos.</p>
          <Link to="/login" className="btn">Iniciar sesión</Link>
        </div>
      </Section>
    );
  }

  const list = useMemo(() =>
    (orders || [])
      .sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""))
      .reverse(),
    [orders]
  );

  return (
    <Section title="Mis pedidos" subtitle="Seguimiento de tus órdenes">
      <div className="grid">
        {list.map((o) => (
          <article key={o.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <strong>Orden #{o.id}</strong>
              <span className="status-pill">{o.estado}</span>
            </div>

            <ul>
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
            </ul>

            <strong>Total: ${o.total}</strong>
          </article>
        ))}

        {!list.length && (
          <div className="card-empty">
            Aún no tienes pedidos. <Link to="/ordenar">Haz uno aquí</Link>.
          </div>
        )}
      </div>
    </Section>
  );
}
