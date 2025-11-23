import { useEffect, useState } from "react";
import Section from "../../components/Section";
import logo from "../../assets/logo_chiludos.png";
import { getMenu } from "../../data/api"; // 👈 ahora viene del backend/Firebase

export default function Home() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMenu();        // 🔥 trae menú desde Firestore
        setMenu(data.filter((m) => m.activo)); // solo platillos activos
      } catch (err) {
        console.error("Error cargando menú:", err);
      }
    };

    load();
  }, []);

  // Toma solo los primeros 3 platillos activos
  const recomendados = menu.slice(0, 3);

  return (
    <>
      {/* === HERO PRINCIPAL === */}
      <Section hero align="center">
        <div style={{ textAlign: "center" }}>
          <img
            src={logo}
            alt="Los Más Chiludos"
            style={{
              width: "340px",
              maxWidth: "80%",
              marginBottom: "20px",
              filter: "drop-shadow(0 6px 6px rgba(0,0,0,.3))",
            }}
          />
          <h1
            style={{
              fontSize: "38px",
              fontWeight: 900,
              color: "#d60000",
              textShadow: "0 2px 0 #ffcb00",
              margin: "0 0 10px",
            }}
          >
            ¡Bienvenido a Los Más Chiludos! 🌮🔥
          </h1>
          <p
            style={{
              maxWidth: "650px",
              margin: "0 auto 30px",
              fontSize: "18px",
              lineHeight: 1.5,
              color: "#333",
            }}
          >
            Saborea nuestros tacos, burritos y antojitos con el auténtico toque
            mexicano. Elaborados con ingredientes frescos, salsas caseras y el
            inigualable sabor que nos hace los más chiludos de la ciudad.
          </p>
          <a
            href="/ordenar"
            style={{
              background: "#d60000",
              color: "#fff",
              padding: "14px 34px",
              borderRadius: "999px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 6px 14px rgba(214,0,0,0.4)",
              fontSize: "18px",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#ff1e1e";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#d60000";
              e.target.style.transform = "scale(1)";
            }}
          >
            ¡Ordena Ahora!
          </a>
        </div>
      </Section>

      {/* === SECCIÓN 2: NUESTRA HISTORIA === */}
      <Section
        title="Nuestra Historia"
        subtitle="Más que tacos, una tradición con sabor mexicano 🇲🇽"
        align="center"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "center",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
            alt="Tacos al pastor"
            style={{
              borderRadius: "20px",
              width: "100%",
              boxShadow: "0 8px 18px rgba(0,0,0,.15)",
            }}
          />
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#444",
              textAlign: "justify",
            }}
          >
            En Los Más Chiludos, llevamos el sazón de nuestras abuelas a cada
            tortilla. Desde 2012 servimos con orgullo los tacos más sabrosos,
            burritos bien rellenos y salsas que te harán decir “¡Ay nanita!”.
            Nuestro compromiso es ofrecer siempre comida fresca, deliciosa y con
            ese toque picante que tanto te gusta.
          </p>
        </div>
      </Section>

      {/* === SECCIÓN 3: PLATILLOS RECOMENDADOS === */}
      <Section title="Platillos Recomendados" subtitle="🔥 De la parrilla a tu mesa">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {recomendados.length > 0 ? (
            recomendados.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  border: "2px solid #ffcb00",
                  overflow: "hidden",
                  boxShadow: "0 8px 18px rgba(0,0,0,.08)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    style={{
                      width: "100%",
                      height: "190px",
                      objectFit: "cover",
                      borderBottom: "2px solid #ffcb00",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200.png?text=Sin+imagen";
                    }}
                  />
                )}
                <div style={{ padding: "12px 16px" }}>
                  <h3
                    style={{
                      margin: "0 0 4px",
                      color: "#d60000",
                      fontWeight: 700,
                    }}
                  >
                    {item.nombre}
                  </h3>
                  <p style={{ fontSize: "14px", opacity: 0.8 }}>
                    {item.descripcion || "¡Sabor que enamora y pica sabroso!"}
                  </p>
                  <strong style={{ color: "#333" }}>${item.precio}</strong>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: 18 }}>
              No hay platillos activos por ahora 😢
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
