// ---- Configuración de la API ----
const API_BASE = 'http://localhost:8000';

// ---- Categorías ----
const CATEGORIES = [
  { id: 'fideos-ramen',   emoji: '🍜', nombre: 'Fideos y ramen' },
  { id: 'salsas',         emoji: '🥢', nombre: 'Salsas y condimentos' },
  { id: 'arroz-cereales', emoji: '🍚', nombre: 'Arroz y cereales' },
  { id: 'congelados',     emoji: '🥟', nombre: 'Congelados y preparados' },
  { id: 'snacks-dulces',  emoji: '🍘', nombre: 'Snacks y dulces' },
  { id: 'bebidas-tes',    emoji: '🍵', nombre: 'Bebidas y tés' },
];

// ---- Adaptador ES ↔ EN ----
const toBackend = (m) => ({
  name:        m.nombre,
  description: m.descripcion,
  price:       m.precio,
  stock:       m.stock,
  img:         m.imagen,
  category:    m.categoria || null,
});

const fromBackend = (m) => ({
  id:          m.id,
  nombre:      m.name,
  descripcion: m.description,
  precio:      Number(m.price),
  stock:       m.stock,
  imagen:      m.img ?? '',
  categoria:   m.category || null,
});

// ---- Cliente HTTP ----
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Error ${response.status}: ${detail || response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

const api = {
  list:   ()           => apiRequest('/menus/').then(arr => arr.map(fromBackend)),
  get:    (id)         => apiRequest(`/menus/${id}`).then(fromBackend),
  create: (data)       => apiRequest('/menus/',      { method: 'POST',   body: JSON.stringify(toBackend(data)) }).then(fromBackend),
  update: (id, data)   => apiRequest(`/menus/${id}`, { method: 'PUT',    body: JSON.stringify(toBackend(data)) }).then(fromBackend),
  remove: (id)         => apiRequest(`/menus/${id}`, { method: 'DELETE' }),
};
