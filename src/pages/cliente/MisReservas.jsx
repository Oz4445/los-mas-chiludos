import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../../components/Section";
import { useAuth } from "../../context/AuthContext";
import { listBookings, cancelBooking } from "../../data/api";
import "../../styles/mislistas.css";

export default function MisReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);

  const load = async () => {
    if (!user) return;
    const data = await listBookings(user.uid);
    setReservas(data);
  };

  useEffect(() => {
    load();
  }, [user]);

  const cancelar = async (reserva) => {
    if (!confirm("¿Seguro que deseas cancelar esta reservación?")) return;

    try {
      const resp = await cancelBooking(reserva.id);
      alert(resp.msg);
      load();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (!user) {
    return (
      <Section title="Mis reservas">
        <div className="card" style={{ padding: 18 }}>
          <p>Inicia sesión para ver tus reservas.</p>
          <Link to="/login" className="btn">Iniciar sesión</Link>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Mis reservas" subtitle="Consulta y gestiona tus reservas">
      <div className="grid">
        {reservas.map((r) => (
          <article key={r.id} className="card" style={{ padding: 16 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <strong>{r.fecha} {r.hora}</strong> · {r.personas} personas
                <span className={`status-pill status-${(r.estado || "pendiente").toLowerCase()}`}>
                  {r.estado}
                </span>
              </div>

              {r.estado !== "cancelada" && (
                <button className="btn btn-outline" onClick={() => cancelar(r)}>
                  Cancelar
                </button>
              )}
            </div>
          </article>
        ))}

        {!reservas.length && (
          <div className="card-empty">
            Aún no tienes reservas. <Link to="/reservar">Haz una aquí</Link>.
          </div>
        )}
      </div>
    </Section>
  );
}
