// src/pages/cliente/Menu.jsx
import { useEffect, useState } from "react";
import Section from "../../components/Section";
import { getMenu } from "../../data/api";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMenu();
        setMenu(data.filter((m) => m.activo));
      } catch (err) {
        console.error("Error cargando menú:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando menú...</p>;

  return (
    <Section title="Menú" subtitle="Disfruta nuestros platillos más chiludos 🌶️">
      <div className="grid">
        {menu.map((m) => (
          <div key={m.id} className="card card--menu">

            {/* ⭐ AQUI SE MUESTRA LA IMAGEN */}
            {m.imagen && (
              <img
                src={m.imagen}
                alt={m.nombre}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  maxHeight: 180,
                  objectFit: "cover",
                  marginBottom: 10,
                }}
              />
            )}

            <div>
              <h3 style={{ margin: 0, color: "#d60000" }}>{m.nombre}</h3>
              <small className="muted">{m.categoria}</small>

              <strong style={{ display: "block", marginTop: 6 }}>
                ${m.precio}
              </strong>
            </div>
          </div>
        ))}

        {!menu.length && (
          <div className="card" style={{ padding: 18, textAlign: "center" }}>
            No hay platillos activos por ahora 😢
          </div>
        )}
      </div>
    </Section>
  );
}
