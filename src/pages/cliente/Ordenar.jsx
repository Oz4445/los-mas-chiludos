import { useEffect, useState } from "react";
import { createOrder, getMenu } from "../../data/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/forms.css";

export default function Ordenar() {
  const { user } = useAuth();

  const [cliente, setCliente] = useState("");
  const [items, setItems] = useState([{ nombre: "", cantidad: 1, precio: 0 }]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMenu();
        const activos = data.filter((p) => p.activo !== false);
        setMenu(activos);
      } catch (e) {
        console.error("Error cargando menú:", e);
      }
    })();
  }, []);

  const total = items.reduce((acc, it) => acc + it.cantidad * it.precio, 0);

  const updateItem = (idx, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );
  };

  const handleSelect = (idx, nombre) => {
    const selected = menu.find((p) => p.nombre === nombre);
    updateItem(idx, "nombre", nombre);
    if (selected) updateItem(idx, "precio", selected.precio);
  };

  const addItem = () =>
    setItems((prev) => [...prev, { nombre: "", cantidad: 1, precio: 0 }]);

  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!cliente || items.length === 0 || total <= 0) {
      setMsg("⚠️ Completa el nombre y agrega platillos válidos.");
      return;
    }

    if (!user) {
      setMsg("⚠️ Debes iniciar sesión para ordenar.");
      return;
    }

    const payload = {
      cliente,
      items,
      total,
      userId: user.uid,   // 🔥🔥🔥 CORREGIDO (antes era user.id)
      createdAt: new Date().toISOString(),
      estado: "recibida",
    };

    setLoading(true);
    try {
      const resp = await createOrder(payload);
      setMsg(`✅ Pedido creado con éxito. ID: ${resp.id}`);
      setCliente("");
      setItems([{ nombre: "", cantidad: 1, precio: 0 }]);
    } catch (err) {
      setMsg("❌ Error al crear pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Crear Pedido</h1>
        <p className="form-subtitle">Arma tu orden con los mejores platillos 🌮🔥</p>

        <form onSubmit={submit} className="form-body">
          <label>Nombre del cliente</label>
          <input
            value={cliente}
            placeholder="Ej. Ana López"
            onChange={(e) => setCliente(e.target.value)}
          />

          <h3 style={{ marginTop: "20px" }}>Platillos</h3>

          {items.map((it, idx) => (
            <div key={idx} className="order-row">
              <select
                value={it.nombre}
                onChange={(e) => handleSelect(idx, e.target.value)}
              >
                <option value="">Selecciona platillo</option>
                {menu.map((p) => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                value={it.cantidad}
                onChange={(e) =>
                  updateItem(idx, "cantidad", Number(e.target.value))
                }
              />

              <input
                type="number"
                min={0}
                value={it.precio}
                readOnly
                style={{ background: "#f9f9f9" }}
              />

              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="btn-outline"
              >
                ✖
              </button>
            </div>
          ))}

          <button type="button" onClick={addItem} className="btn-outline">
            + Agregar platillo
          </button>

          <div className="order-total">Total: ${total.toFixed(2)}</div>

          {msg && <div className="form-msg">{msg}</div>}

          <button disabled={loading} className="btn">
            {loading ? "Creando..." : "Confirmar pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
