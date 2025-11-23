// ====== Semillas de datos y utilidades ======

export function seedAll() {
  // Menú
  if (!localStorage.getItem('menuItems')) {
    const base = [
      { id: 'm1', category: 'Tacos',    name: 'Taco Pastor',     price: 25, description: 'Con piña',    active: true, image: '' },
      { id: 'm2', category: 'Tacos',    name: 'Taco Suadero',    price: 28, description: 'Suavecito',   active: true, image: '' },
      { id: 'm3', category: 'Especial', name: 'Quesabirria',     price: 55, description: 'Con consomé', active: true, image: '' },
      { id: 'm4', category: 'Especial', name: 'Burrito Chiludo', price: 95, description: 'Grandote',    active: true, image: '' },
    ];
    localStorage.setItem('menuItems', JSON.stringify(base));
  }

  // Reservas / Órdenes
  if (!localStorage.getItem('reservations')) localStorage.setItem('reservations', '[]');
  if (!localStorage.getItem('orders'))       localStorage.setItem('orders', '[]');

  // Mesas
  if (!localStorage.getItem('tables')) {
    const baseTables = Array.from({ length: 10 }).map((_,i)=>({ id:`t${i+1}`, name:`Mesa ${i+1}`, status:'libre' }));
    localStorage.setItem('tables', JSON.stringify(baseTables));
  }

  // Usuarios
  if (!localStorage.getItem('users')) {
    const baseUsers = [
      { id: 'u_admin',  name: 'Administrador', email: 'admin@chiludos.mx',  role: 'admin',  active: true,  phone: '555-000-0000', passwordHash: hash('123456') },
      { id: 'u_mesero', name: 'Mesero Demo',   email: 'mesero@chiludos.mx', role: 'mesero', active: true,  phone: '555-111-1111', passwordHash: hash('123456') },
      { id: 'u_cli',    name: 'Cliente Demo',  email: 'cliente@chiludos.mx',role: 'cliente',active: true,  phone: '555-222-2222', passwordHash: hash('123456') },
    ];
    localStorage.setItem('users', JSON.stringify(baseUsers));
  }

  // Garantiza al menos 1 admin activo y con hash correcto
  ensureAdmin();
}

export function ensureAdmin() {
  const users = get('users', []);
  // busca admin
  let admin = users.find(u => (u.email || '').toLowerCase().trim() === 'admin@chiludos.mx');

  if (admin) {
    // repara estado por si quedó raro
    admin.role = 'admin';
    admin.active = true;
    if (!admin.passwordHash) admin.passwordHash = hash('123456');
  } else {
    // si no existe ningún admin, crea uno
    admin = {
      id: 'u_admin_default',
      name: 'Administrador',
      email: 'admin@chiludos.mx',
      role: 'admin',
      active: true,
      phone: '555-000-0000',
      passwordHash: hash('123456'),
    };
    users.push(admin);
  }

  // si no hay admins activos (caso extremo), reactiva uno
  const activeAdmins = users.filter(u => u.role === 'admin' && u.active);
  if (activeAdmins.length === 0) admin.active = true;

  set('users', users);
}

// ==== utilidades de almacenamiento + evento global ====
export const storage = { get, set };

function get(key, def = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); }
  catch { return def; }
}
function set(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new CustomEvent('data:changed', { detail: key }));
}

// ==== hash (mock) ====
export function hash(plain) {
  try { return btoa(String(plain)); } catch { return String(plain); }
}

// Retro-compatible: acepta base64 o texto plano legado
export function compareHash(plain, hashed) {
  try {
    const p = String(plain || '');
    const h = String(hashed || '');
    return btoa(p) === h || p === h;
  } catch {
    return String(plain || '') === String(hashed || '');
  }
}
