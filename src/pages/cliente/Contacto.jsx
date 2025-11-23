// src/pages/public/Contacto.jsx
import { useState } from "react";
import Section from "../../components/Section";
import logo from "../../assets/logo_chiludos.png";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    motivo: "reservacion",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí en un futuro puedes llamar a tu API o mandar correo
    if (!form.nombre || !form.mensaje) {
      alert("Por favor llena al menos tu nombre y el mensaje 🙂");
      return;
    }
    setEnviado(true);
    // limpiar un poco
    setForm((p) => ({ ...p, mensaje: "" }));
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <>
      {/* HERO */}
      <Section hero align="center">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <img
            src={logo}
            alt="Los Más Chiludos"
            style={{
              width: "220px",
              filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.25))",
              marginBottom: "10px",
            }}
          />
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#d60000",
              textShadow: "0 2px 0 #ffcb00",
              marginBottom: "8px",
            }}
          >
            ¡Hablemos! 📞
          </h1>
          <p
            style={{
              maxWidth: "650px",
              margin: "0 auto",
              fontSize: "17px",
              lineHeight: 1.5,
              color: "#444",
            }}
          >
            ¿Tienes dudas, quieres hacer una reservación especial o cotizar
            para un evento? Escríbenos y con gusto te atendemos.
          </p>
        </div>
      </Section>

      {/* CONTENIDO PRINCIPAL */}
      <Section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* FORMULARIO */}
          <div
            className="card"
            style={{
              padding: "22px 24px",
              borderRadius: "18px",
              border: "2px solid #ffcb00",
              boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
              background: "#fff",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "6px",
                color: "#d60000",
                fontWeight: 800,
                fontSize: "22px",
              }}
            >
              Envíanos un mensaje
            </h2>
            <p style={{ marginTop: 0, marginBottom: "14px", color: "#555" }}>
              Llena el formulario y te contactamos lo antes posible.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div>
                <label style={{ fontWeight: 600, fontSize: 14 }}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  style={{ width: "100%", marginTop: 4 }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    placeholder="Ej. 777-123-4567"
                    style={{ width: "100%", marginTop: 4 }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={(e) => set("correo", e.target.value)}
                    placeholder="Ej. cliente@email.com"
                    style={{ width: "100%", marginTop: 4 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: 14 }}>Motivo</label>
                <select
                  value={form.motivo}
                  onChange={(e) => set("motivo", e.target.value)}
                  style={{ width: "100%", marginTop: 4 }}
                >
                  <option value="reservacion">Reservación</option>
                  <option value="evento">Evento especial / banquete</option>
                  <option value="comentario">Comentario o sugerencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: 14 }}>Mensaje</label>
                <textarea
                  rows={4}
                  value={form.mensaje}
                  onChange={(e) => set("mensaje", e.target.value)}
                  placeholder="Cuéntanos cómo te podemos ayudar…"
                  style={{ width: "100%", marginTop: 4, resize: "vertical" }}
                ></textarea>
              </div>

              {enviado && (
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    fontSize: 14,
                  }}
                >
                  ✅ Gracias, recibimos tu mensaje. Te contactaremos pronto.
                </div>
              )}

              <button
                type="submit"
                className="btn"
                style={{
                  marginTop: "8px",
                  alignSelf: "flex-start",
                  paddingInline: "28px",
                }}
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* INFO DE CONTACTO / MAPITA */}
          <div
            className="card"
            style={{
              padding: "22px 24px",
              borderRadius: "18px",
              background: "#fffdf5",
              border: "2px solid #ffe08a",
              boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "6px",
                color: "#d60000",
                fontWeight: 800,
                fontSize: "22px",
              }}
            >
              Datos de contacto
            </h2>

            <p style={{ marginTop: 0, color: "#555", marginBottom: 14 }}>
              También puedes escribirnos o llamarnos directamente:
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Teléfono:</strong> 777 000 00 00
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>WhatsApp:</strong> 777 000 00 00
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Correo:</strong> contacto@losmaschiludos.com
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Dirección:</strong> Los Más Chiludos, Zacatepec, Mor.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Horario:</strong> Lun–Dom 12:00 pm – 10:00 pm
              </li>
            </ul>

            <div
              style={{
                marginTop: 18,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid #ffd54f",
              }}
            >
              <iframe
                title="Mapa Los Más Chiludos"
                src="https://www.google.com/maps?q=Los+Mas+Chiludos&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
