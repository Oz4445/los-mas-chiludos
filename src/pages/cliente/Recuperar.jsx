import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Section from "../../components/Section";

export default function Recuperar() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const r = await resetPassword(email.trim());
      setMsg(r);
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <Section
      title="Recuperar contraseña"
      subtitle="Te enviaremos un correo con un enlace para restablecer tu contraseña."
    >
      <form className="card" style={{ padding: 18, maxWidth: 420 }} onSubmit={handleSubmit}>
        {err && <div style={{ color: "crimson", marginBottom: 10 }}>{err}</div>}
        {msg && <div style={{ color: "green", marginBottom: 10 }}>{msg}</div>}

        <label>Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 10,
            margin: "6px 0 12px",
            width: "100%",
          }}
        />

        <button className="btn" style={{ width: "100%" }}>
          Enviar correo de recuperación
        </button>
      </form>
    </Section>
  );
}
