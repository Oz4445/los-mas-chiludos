import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Section from "../../components/Section";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const u = await login(email.trim(), password.trim());

      if (u.role === "admin") nav("/admin");
      else if (u.role === "mesero") nav("/mesero/mesas");
      else nav("/");
    } catch (e) {
      setErr(e.message || "Error al iniciar sesión");
    }
  };

  return (
    <Section
      title="Iniciar sesión"
      subtitle="Sean bienvenidos donde disfrutaran cada bocado"
    >
      <form className="card" style={{ padding: 18, maxWidth: 420 }} onSubmit={onSubmit}>
        {err && <div style={{ color: "crimson", marginBottom: 10 }}>{err}</div>}

        <label>Correo</label>
        <input
          style={i}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label>Contraseña</label>
        <input
          style={i}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button className="btn" style={{ width: "100%" }}>
          Entrar
        </button>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <Link to="/recuperar" style={{ color: "var(--accent)", fontWeight: 600 }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <span className="muted">¿No tienes cuenta?</span>{" "}
          <Link to="/signup" style={{ fontWeight: 600, color: "var(--accent)" }}>
            Regístrate
          </Link>
        </div>
      </form>
    </Section>
  );
}

const i = {
  padding: 10,
  border: "1px solid #ddd",
  borderRadius: 10,
  margin: "6px 0 12px",
  width: "100%",
};
