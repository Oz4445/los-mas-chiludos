import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Signup() {
  const { registerUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(email, password);
      alert("✅ Cuenta creada correctamente");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Crear cuenta</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}
