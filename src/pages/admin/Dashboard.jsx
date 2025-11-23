import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; // ✅ para navegación interna
import Section from "../../components/Section";
import { seedAll, storage } from "../../data/seed";
import { FaUtensils, FaClipboardList, FaUsers, FaChair } from "react-icons/fa";

export default function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [menu, setMenu] = useState([]);
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    seedAll(); // datos iniciales
    setReservas(storage.get("reservations"));
    setOrdenes(storage.get("orders"));
    setMenu(storage.get("menuItems"));
    setMesas(storage.get("tables"));
  }, []);

  // === KPIs ===
  const hoy = new Date().toISOString().slice(0, 10);
  const reservasHoy = useMemo(
    () => reservas.filter((r) => r.date === hoy).length,
    [reservas, hoy]
  );
  const ordenesTotal = useMemo(() => ordenes.length, [ordenes]);
  const platillosActivos = useMemo(
    () => menu.filter((m) => m.active).length,
    [menu]
  );
  const ocupadas = useMemo(
    () => mesas.filter((m) => m.status === "ocupada").length,
    [mesas]
  );
  const ocupacionPct = mesas.length
    ? Math.round((ocupadas / mesas.length) * 100)
    : 0;

  return (
    <Section
      title="Panel de administración"
      subtitle="Resumen operativo y accesos rápidos"
    >
      {/* === KPIs === */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        <KPI
          icon={<FaUsers color="#d60000" />}
          title="Reservas hoy"
          value={reservasHoy}
        />
        <KPI
          icon={<FaClipboardList color="#d60000" />}
          title="Órdenes registradas"
          value={ordenesTotal}
        />
        <KPI
          icon={<FaUtensils color="#d60000" />}
          title="Platillos activos"
          value={platillosActivos}
        />
        <KPI
          icon={<FaChair color="#d60000" />}
          title={`Ocupación (${mesas.length} mesas)`}
          value={`${ocupacionPct}%`}
        />
      </div>

      {/* === ACCESOS RÁPIDOS Y CONSEJOS === */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "18px",
        }}
      >
        <Card title="Accesos rápidos">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              lineHeight: 2,
              listStyle: "none",
            }}
          >
            <QuickLink to="/admin/menu" text="Gestionar Menú" />
            <QuickLink to="/admin/reservas" text="Reservas" />
            <QuickLink to="/admin/ordenes" text="Órdenes" />
            <QuickLink to="/admin/usuarios" text="Usuarios" />
            <QuickLink to="/admin/ajustes" text="Ajustes del sistema" />
          </ul>
        </Card>

        <Card title="Consejos de operación">
          <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.6 }}>
            ✅ Mantén tus <b>platillos activos</b> y bien descritos.<br />
            💰 Actualiza precios y categorías (Tacos, Especiales, Bebidas).<br />
            ⚙️ Revisa las reservas y órdenes diarias para detectar picos de
            actividad.<br />
            🔐 Desactiva usuarios inactivos o con actividad sospechosa.
          </p>
        </Card>
      </div>
    </Section>
  );
}

// === Subcomponentes ===
function KPI({ icon, title, value }) {
  return (
    <div
      className="card"
      style={{
        padding: 20,
        borderLeft: "6px solid #ffcb00",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon}
        <div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>{title}</div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#d60000",
              marginTop: 2,
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div
      className="card"
      style={{
        padding: 18,
        border: "2px solid #ffcb00",
        borderRadius: 16,
        boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 8px", color: "#d60000" }}>{title}</h3>
      {children}
    </div>
  );
}

// ✅ Enlaces internos con React Router
function QuickLink({ to, text }) {
  return (
    <li>
      <Link
        to={to}
        style={{
          color: "#d60000",
          textDecoration: "none",
          fontWeight: "600",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#a50000")}
        onMouseLeave={(e) => (e.target.style.color = "#d60000")}
      >
        → {text}
      </Link>
    </li>
  );
}
