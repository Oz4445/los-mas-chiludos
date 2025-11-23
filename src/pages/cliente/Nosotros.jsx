import Section from "../../components/Section";
import logo from "../../assets/logo_chiludos.png";

export default function Nosotros() {
  return (
    <>
      {/* === HERO / ENCABEZADO === */}
      <Section hero align="center">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 900,
              color: "#d60000",
              textShadow: "0 2px 0 #ffcb00",
              marginBottom: "10px",
            }}
          >
            Nuestra Historia 🌮🔥
          </h1>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "18px",
              lineHeight: 1.5,
              color: "#444",
            }}
          >
            Conoce el origen, la pasión y la tradición que hacen de
            <strong> Los Más Chiludos </strong>
            un restaurante único en la ciudad.
          </p>

          <img
            src={logo}
            alt="Los Más Chiludos"
            style={{
              width: "260px",
              filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.25))",
              marginTop: "20px",
            }}
          />
        </div>
      </Section>

      {/* === SECCIÓN HISTORIA === */}
      <Section
        title="De Dónde Venimos"
        subtitle="Un pedacito de México en cada platillo 🇲🇽"
        align="center"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "center",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <img
            src="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg"
            alt="Tacos mexicanos"
            style={{
              borderRadius: "20px",
              width: "100%",
              height: "100%",
              maxHeight: "420px",
              objectFit: "cover",
              boxShadow: "0 8px 18px rgba(0,0,0,.15)",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/900x600.png?text=Los+Mas+Chiludos";
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
            Nacimos en el corazón de un pequeño barrio lleno de tradición,
            donde las recetas de la abuela se convirtieron en el pilar de
            nuestra cocina. Desde 2012, nuestra misión ha sido compartir con el
            mundo los platillos más sabrosos, picantes y llenos de amor mexicano.
            Cada tortilla hecha a mano, cada salsa preparada al día y cada taco
            servido cuenta una historia que nos llena de orgullo.
          </p>
        </div>
      </Section>

      {/* === SECCIÓN MISIÓN / VISIÓN === */}
      <Section
        title="Nuestra Esencia"
        subtitle="Lo que nos mueve día a día"
        align="center"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "2px solid #ffcb00",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                color: "#d60000",
                fontWeight: "800",
                marginBottom: "8px",
                fontSize: "20px",
              }}
            >
              Nuestra Misión
            </h3>
            <p style={{ color: "#444", lineHeight: 1.6 }}>
              Llevar a cada mesa el auténtico sabor mexicano con ingredientes
              frescos, recetas tradicionales y un servicio lleno de calidez.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "2px solid #ffcb00",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                color: "#d60000",
                fontWeight: "800",
                marginBottom: "8px",
                fontSize: "20px",
              }}
            >
              Nuestra Visión
            </h3>
            <p style={{ color: "#444", lineHeight: 1.6 }}>
              Ser el restaurante favorito de la ciudad, reconocido por su sabor
              único, atención excepcional y un ambiente que te hace sentir como en casa.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "2px solid #ffcb00",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                color: "#d60000",
                fontWeight: "800",
                marginBottom: "8px",
                fontSize: "20px",
              }}
            >
              Nuestros Valores
            </h3>
            <p style={{ color: "#444", lineHeight: 1.6 }}>
              Tradición, frescura, pasión, calidad y amor por nuestra gente y
              nuestros sabores.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
