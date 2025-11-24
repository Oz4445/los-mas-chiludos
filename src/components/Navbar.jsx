import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { storage } from "../data/seed";
import "../styles/navbar.css"; // 🔥 IMPORTANTE

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  // --- Contadores globales (Mesero/Admin) ---
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingReservas, setPendingReservas] = useState(0);

  // --- Contadores del cliente ---
  const [myActiveOrders, setMyActiveOrders] = useState(0);
  const [myActiveRes, setMyActiveRes] = useState(0);

  // --- Menú hamburguesa (responsive) ---
  const [menuOpen, setMenuOpen] = useState(false);

  const refreshCounts = () => {
    const orders = storage.get("orders") || [];
    const activos = orders.filter((o) =>
      ["recibida", "en preparación", "lista"].includes(o.status)
    ).length;
    setPendingOrders(activos);

    const today = new Date().toISOString().slice(0, 10);
    const reservas = storage.get("reservations") || [];
    const pend = reservas.filter(
      (r) => r.date === today && r.status === "pendiente"
    ).length;
    setPendingReservas(pend);

    if (user?.id) {
      const mineOrders = orders.filter(
        (o) =>
          o.userId === user.id &&
          ["recibida", "en preparación", "lista"].includes(o.status)
      ).length;
      setMyActiveOrders(mineOrders);

      const mineRes = reservas.filter(
        (r) =>
          r.userId === user.id &&
          ["pendiente", "en mesa", "confirmada"].includes(r.status)
      ).length;
      setMyActiveRes(mineRes);
    } else {
      setMyActiveOrders(0);
      setMyActiveRes(0);
    }
  };

  useEffect(() => {
    refreshCounts();
    const h = () => refreshCounts();
    window.addEventListener("data:changed", h);
    const id = setInterval(refreshCounts, 1500);
    return () => {
      window.removeEventListener("data:changed", h);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [user]);

  useEffect(() => {
    setMenuOpen(false); // cerrar menú en móvil al cambiar página
    refreshCounts();
  }, [location.pathname]);

  const totalMesero = useMemo(
    () => pendingOrders + pendingReservas,
    [pendingOrders, pendingReservas]
  );
  const totalAdmin = totalMesero;

  const [openMesero, setOpenMesero] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const refMesero = useRef(null);
  const refAdmin = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (refMesero.current && !refMesero.current.contains(e.target))
        setOpenMesero(false);
      if (refAdmin.current && !refAdmin.current.contains(e.target))
        setOpenAdmin(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpenMesero(false);
        setOpenAdmin(false);
      }
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  const bestMeseroPath = () => {
    if (pendingOrders > 0) return "/mesero/ordenes";
    if (pendingReservas > 0) return "/mesero/reservas";
    return "/mesero/mesas";
  };

  const isAdmin = user?.role === "admin";
  const isMesero = user?.role === "mesero";
  const isCliente = user?.role === "cliente";

  const goHomeLogout = () => {
    logout();
    setPendingOrders(0);
    setPendingReservas(0);
    setMyActiveOrders(0);
    setMyActiveRes(0);
    nav("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#fff",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container nav-container">
        <Link to="/" aria-label="Inicio">
          <strong>Los Más Chiludos</strong>
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button className="nav-toggle" onClick={() => setMenuOpen((v) => !v)}>
          ☰
        </button>

        {/* NAV LINKS */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/menu">Menú</NavLink>
          <NavLink to="/reservas">Reservar</NavLink>
          <NavLink to="/ordenar">Ordenar</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>

          {/* Cliente */}
          {isCliente && (
            <>
              <NavLink to="/mis-reservas">
                Mis reservas{" "}
                {myActiveRes > 0 && <span className="badge">{myActiveRes}</span>}
              </NavLink>
              <NavLink to="/mis-pedidos">
                Mis pedidos{" "}
                {myActiveOrders > 0 && (
                  <span className="badge">{myActiveOrders}</span>
                )}
              </NavLink>
            </>
          )}

          {/* Mesero */}
          {isMesero && (
            <div className="dropdown" ref={refMesero}>
              <button
                className="btn btn-outline"
                onClick={() => nav(bestMeseroPath())}
              >
                Mesero{" "}
                {totalMesero > 0 && <span className="badge">{totalMesero}</span>}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setOpenMesero((v) => !v)}
              >
                ▾
              </button>
            </div>
          )}

          {/* Admin */}
          {isAdmin && (
            <div className="dropdown" ref={refAdmin}>
              <button
                className="btn btn-outline"
                onClick={() => setOpenAdmin((v) => !v)}
              >
                Admin{" "}
                {totalAdmin > 0 && <span className="badge">{totalAdmin}</span>} ▾
              </button>
            </div>
          )}

          {/* Login / logout */}
          {!user && (
            <>
              <NavLink to="/signup" className="btn btn-outline">
                Registrar
              </NavLink>
              <NavLink to="/login" className="btn">
                Entrar
              </NavLink>
            </>
          )}
          {user && (
            <button className="btn btn-outline" onClick={goHomeLogout}>
              Salir ({user.name?.split(" ")[0] || "Usuario"})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
