import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "../../styles/forms.css";

export default function Signup() {
  const { registerUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg(null);

    setLoading(true);
    try {
      await registerUser(email, password);
      setMsg("✅ Cuenta creada correctamente 🎉");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        
        <h1 className="form-title">Crear Cuenta</h1>
        <p className="form-subtitle">
          Regístrate para comenzar a ordenar y reservar 🌮🔥
        </p>

        <form onSubmit={handleSignup} className="form-body">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {msg && <div className="form-msg">{msg}</div>}

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>
      </div>
    </div>
  );
}
