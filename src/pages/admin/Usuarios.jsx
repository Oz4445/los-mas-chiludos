import { useEffect, useMemo, useState } from "react";
import Section from "../../components/Section";
import { useAuth } from "../../context/AuthContext";

const ROLES = ["cliente", "mesero", "admin"];

export default function Usuarios() {
  const {
    user: me,
    updateUser,
    toggleActive,
    resetPassword,
    removeUser,
    registerUser,
  } = useAuth();

  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("todos");
  const [status, setStatus] = useState("todos");

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    role: "cliente",
    password: "",
  });

  // 🔁 Cargar usuarios desde Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/los-mas-chiludos/databases/(default)/documents/users");
        const data = await res.json();
        if (data.documents) {
          const list = data.documents.map((d) => ({
            id: d.name.split("/").pop(),
            ...Object.fromEntries(
              Object.entries(d.fields || {}).map(([k, v]) => [k, Object.values(v)[0]])
            ),
          }));
          setUsers(list);
        }
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };
    fetchUsers();
  }, []);

  const list = useMemo(() => {
    let data = [...users];
    if (role !== "todos") data = data.filter((u) => u.role === role);
    if (status !== "todos")
      data = data.filter((u) =>
        status === "activos" ? u.active === "true" || u.active === true : u.active === "false" || u.active === false
      );
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      data = data.filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          (u.phone || "").toLowerCase().includes(s)
      );
    }
    return data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [users, q, role, status]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () =>
    setForm({ id: null, name: "", email: "", phone: "", role: "cliente", password: "" });

  // 💾 Crear o editar usuario
  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.role) return alert("Faltan datos obligatorios");

    try {
      if (form.id) {
        await updateUser(form.id, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
        });
        alert("Usuario actualizado correctamente");
      } else {
        await registerUser(form.email, form.password || "123456", form.role);
        alert("Usuario creado correctamente.");
      }
      resetForm();
      window.location.reload(); // 🔄 Refresca lista
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // ✏️ Editar usuario
  const editar = (u) =>
    setForm({
      id: u.id,
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "cliente",
      password: "",
    });

  // 🔄 Activar / desactivar usuario
  const cambiarActivo = async (u) => {
    try {
      await toggleActive(u.id);
      alert("Estado actualizado correctamente.");
      window.location.reload();
    } catch (err) {
      alert("Error al cambiar estado: " + err.message);
    }
  };

  // 🔐 Restablecer contraseña
  const restablecer = async (u) => {
    try {
      await resetPassword(u.email);
      alert("Correo de recuperación enviado a " + u.email);
    } catch (err) {
      alert("Error al enviar correo: " + err.message);
    }
  };

  // 🗑️ Eliminar usuario
  const eliminar = async (u) => {
    if (me?.uid === u.id) return alert("No puedes eliminar tu propia cuenta.");
    if (!confirm(`¿Eliminar a ${u.name || u.email}?`)) return;
    try {
      await removeUser(u.id);
      alert("Usuario eliminado correctamente.");
      setUsers(users.filter((x) => x.id !== u.id));
    } catch (err) {
      alert("Error al eliminar usuario: " + err.message);
    }
  };

  // 🧱 UI
  return (
    <Section title="Usuarios (Admin)" subtitle="Gestiona cuentas y permisos">
      {/* 🔎 Filtros */}
      <div
        className="card"
        style={{
          padding: 12,
          marginBottom: 16,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Buscar (nombre/correo/teléfono)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 10,
            minWidth: 260,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
          >
            <option value="todos">Rol: todos</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
          >
            <option value="todos">Estado: todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => {
            setQ("");
            setRole("todos");
            setStatus("todos");
          }}
        >
          Limpiar
        </button>
      </div>

      {/* 🧾 Formulario */}
      <form
        className="card"
        onSubmit={submit}
        style={{ padding: 16, marginBottom: 20 }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}
        >
          <div>
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={onChange} />
          </div>
          <div>
            <label>Correo</label>
            <input name="email" value={form.email} onChange={onChange} />
          </div>
          <div>
            <label>Teléfono</label>
            <input name="phone" value={form.phone} onChange={onChange} />
          </div>
          <div>
            <label>Rol</label>
            <select name="role" value={form.role} onChange={onChange}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          {!form.id && (
            <div>
              <label>Contraseña inicial</label>
              <input
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="(opcional, default 123456)"
              />
            </div>
          )}
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button className="btn" type="submit">
            {form.id ? "Guardar cambios" : "Crear usuario"}
          </button>
          {form.id && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* 📋 Lista */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        {list.map((u) => (
          <article key={u.id} className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{u.name || "Sin nombre"}</strong> ·{" "}
                <small className="muted">{u.role}</small>
                <br />
                <small>{u.email}</small> · <small>{u.phone || "—"}</small>
              </div>
              <span
                className="btn btn-outline"
                style={{ padding: "2px 8px" }}
              >
                {u.active === "false" || u.active === false
                  ? "Inactivo"
                  : "Activo"}
              </span>
            </div>

            <div
              className="card-actions"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10,
              }}
            >
              <button className="btn" onClick={() => editar(u)} type="button">
                Editar
              </button>
              <button
                className="btn btn-outline"
                onClick={() => cambiarActivo(u)}
                type="button"
              >
                {u.active === "false" || u.active === false
                  ? "Activar"
                  : "Desactivar"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => restablecer(u)}
                type="button"
              >
                Reset pass
              </button>
              <button
                className="btn btn-outline"
                onClick={() => eliminar(u)}
                type="button"
                disabled={me?.uid === u.id}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
        {!list.length && (
          <div className="card" style={{ padding: 18 }}>
            No hay usuarios con estos filtros.
          </div>
        )}
      </div>
    </Section>
  );
}
