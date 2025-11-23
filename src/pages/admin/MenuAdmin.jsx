import { useEffect, useMemo, useState } from "react";
import Section from "../../components/Section";
import {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../data/api";

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: null,
    category: "",
    name: "",
    price: "",
    image: "",   // ← ahora es solo URL
    description: "",
  });
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const data = await getMenu();
      setItems(data);
    } catch (e) {
      console.error(e);
      alert("Error cargando menú: " + e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter(
      (i) =>
        i.nombre.toLowerCase().includes(s) ||
        (i.categoria || "").toLowerCase().includes(s) ||
        (i.descripcion || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();

    const precio = Number(form.price || 0);
    if (!form.name || !form.category || isNaN(precio)) {
      alert("Datos inválidos");
      return;
    }

    const payload = {
      nombre: form.name,
      precio,
      categoria: form.category,
      descripcion: form.description,
      imagen: form.image,   // ← URL
    };

    if (form.id) {
      await updateMenuItem(form.id, payload);
    } else {
      await addMenuItem(payload);
    }

    setForm({
      id: null,
      category: "",
      name: "",
      price: "",
      image: "",
      description: "",
    });

    load();
  };

  const editar = (it) =>
    setForm({
      id: it.id,
      category: it.categoria,
      name: it.nombre,
      price: it.precio,
      image: it.imagen || "",
      description: it.descripcion || "",
    });

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar platillo?")) return;
    await deleteMenuItem(id);
    load();
  };

  const toggle = async (it) => {
    await updateMenuItem(it.id, { activo: !it.activo });
    load();
  };

  return (
    <Section title="Menú (Admin)" subtitle="Gestiona platillos fácilmente">
      <div className="card" style={{ padding: 12, marginBottom: 16 }}>
        <input
          placeholder="Buscar platillos…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 10,
            minWidth: 260,
          }}
        />
      </div>

      {/* FORMULARIO */}
      <form className="card" onSubmit={submit} style={{ padding: 16 }}>
        <label>Categoría</label>
        <input name="category" value={form.category} onChange={onChange} />

        <label>Nombre</label>
        <input name="name" value={form.name} onChange={onChange} />

        <label>Precio</label>
        <input
          name="price"
          value={form.price}
          onChange={onChange}
          inputMode="decimal"
        />

        <label>Imagen (URL)</label>
        <input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="https://ejemplo.com/foto.jpg"
        />

        {form.image && (
          <img
            src={form.image}
            alt="preview"
            style={{
              width: 140,
              borderRadius: 10,
              marginTop: 8,
              marginBottom: 8,
            }}
          />
        )}

        <label>Descripción</label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={onChange}
        />

        <button className="btn" type="submit">
          {form.id ? "Guardar cambios" : "Agregar platillo"}
        </button>

        {form.id && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              setForm({
                id: null,
                category: "",
                name: "",
                price: "",
                image: "",
                description: "",
              })
            }
            style={{ marginLeft: 8 }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* LISTA */}
      <div className="card-grid">
        {filtered.map((it) => (
          <article key={it.id} className="card card--menu">
            <div>
              <b>{it.nombre}</b> · <small>{it.categoria}</small>
            </div>

            {it.imagen && (
              <img
                src={it.imagen}
                alt={it.nombre}
                style={{ borderRadius: 10, maxHeight: 140 }}
              />
            )}

            <p>{it.descripcion}</p>

            <div className="card-actions">
              <span className="btn btn-outline">
                {it.activo ? "Activo" : "Inactivo"}
              </span>

              <button className="btn" onClick={() => editar(it)}>
                Editar
              </button>

              <button className="btn btn-outline" onClick={() => toggle(it)}>
                {it.activo ? "Desactivar" : "Activar"}
              </button>

              <button
                className="btn btn-outline"
                onClick={() => eliminar(it.id)}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
