const API_BASE = 'http://localhost:8000';

// ---- Categorías (mismas que en script.js) ----
const CATEGORIES = [
  { id: 'fideos-ramen',   emoji: '🍜', nombre: 'Fideos y ramen' },
  { id: 'salsas',         emoji: '🥢', nombre: 'Salsas y condimentos' },
  { id: 'arroz-cereales', emoji: '🍚', nombre: 'Arroz y cereales' },
  { id: 'congelados',     emoji: '🥟', nombre: 'Congelados y preparados' },
  { id: 'snacks-dulces',  emoji: '🍘', nombre: 'Snacks y dulces' },
  { id: 'bebidas-tes',    emoji: '🍵', nombre: 'Bebidas y tés' },
];

// ---- Estado compartido necesario para el Admin ----
let menus = [];
let editingId = null;

// ---- Adaptador ES ↔ EN (Copiado de tu script original para que traduzca en el Admin) ----
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

// ---- Cliente HTTP (Copiado de tu script original para que el Admin pueda conectarse) ----
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

// ---- Render: Admin table ----
function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  const empty = document.getElementById('admin-empty');
  if (menus.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = menus.map(m => {
    const cat = CATEGORIES.find(c => c.id === m.categoria);
    return `
    <tr>
      <td class="admin__cell-img">${m.imagen}</td>
      <td><strong>${m.nombre}</strong></td>
      <td>${cat ? cat.nombre : '—'}</td>
      <td>$${Number(m.precio).toFixed(2)}</td>
      <td>${m.stock}</td>
      <td class="admin__cell-actions">
        <button class="admin__btn admin__btn--edit" data-id="${m.id}">✏️</button>
        <button class="admin__btn admin__btn--delete" data-id="${m.id}">🗑️</button>
      </td>
    </tr>
  `;}).join('');
}

function syncUI() {
  // Se quitó renderCatalog(); de aquí porque en admin.html ya no hay catálogo
  renderAdminTable();
}

// ---- Carga inicial desde la API ----
async function loadMenus() {
  try {
    menus = await api.list();
    syncUI();
  } catch (err) {
    console.error('No se pudieron cargar los menús:', err);
    const container = document.getElementById('catalog-container');
    if (container) {
      container.innerHTML = `<p class="admin__empty" style="display:block">No se pudo conectar con la API (${API_BASE}). Revisa que el backend esté en ejecución.</p>`;
    }
  }
}

// ---- CRUD: wrappers async ----
async function addMenu(data) {
  const created = await api.create(data);
  menus.push(created);
  syncUI();
}

async function updateMenu(id, data) {
  const updated = await api.update(id, data);
  const idx = menus.findIndex(m => m.id === id);
  if (idx !== -1) menus[idx] = updated;
  syncUI();
}

async function deleteMenu(id) {
  await api.remove(id);
  menus = menus.filter(m => m.id !== id);
  if (editingId === id) cancelEdit();
  syncUI();
}

// ---- Emoji picker ----
const EMOJI_CHOICES = [
  '🍣', '🍱', '🍜', '🍲', '🍛', '🍝', '🥟', '🥢',
  '🍚', '🍢', '🥠', '🍙', '🍘',
  '🍡', '🍮', '🍰', '🍵', '🧋',
  '🍤', '🍗', '🥩', '🍖', '🥚',
  '🥗', '🥬', '🌶️', '🥒', '🧄',
  '🍊', '🍋', '🍓', '🍑', '🥝',
];

function renderEmojiGrid() {
  const grid = document.getElementById('emoji-picker-grid');
  if (!grid) return;
  grid.innerHTML = EMOJI_CHOICES.map(e =>
    `<button type="button" class="emoji-picker__btn" data-emoji="${e}" aria-label="Elegir ${e}">${e}</button>`
  ).join('');
}

function setEmojiSelection(emoji) {
  const value = (emoji || '').trim();
  const input = document.getElementById('admin-image');
  const preview = document.getElementById('emoji-picker-current');
  const fallback = EMOJI_CHOICES[0];
  const current = value || fallback;
  input.value = current;
  preview.textContent = current;
  document.querySelectorAll('.emoji-picker__btn').forEach(btn => {
    btn.classList.toggle('emoji-picker__btn--selected', btn.dataset.emoji === current);
  });
}

function initEmojiPicker() {
  renderEmojiGrid();
  setEmojiSelection(document.getElementById('admin-image').value);

  document.getElementById('emoji-picker-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.emoji-picker__btn');
    if (!btn) return;
    setEmojiSelection(btn.dataset.emoji);
  });

  document.getElementById('admin-image').addEventListener('input', (e) => {
    setEmojiSelection(e.target.value);
  });
}

// ---- Admin form handlers ----
const adminForm = document.getElementById('admin-form');
const adminSubmit = document.getElementById('admin-submit');
const adminCancel = document.getElementById('admin-cancel');
const formTitle = document.getElementById('form-title');

function populateCategorySelect() {
  const sel = document.getElementById('admin-category');
  if (!sel) return;
  sel.innerHTML = `<option value="" disabled selected>Seleccionar categoría</option>
    ${CATEGORIES.map(c => `<option value="${c.id}">${c.emoji} ${c.nombre}</option>`).join('')}`;
}

function getFormData() {
  return {
    nombre: document.getElementById('admin-name').value.trim(),
    descripcion: document.getElementById('admin-desc').value.trim(),
    precio: parseFloat(document.getElementById('admin-price').value),
    stock: parseInt(document.getElementById('admin-stock').value, 10),
    imagen: document.getElementById('admin-image').value.trim(),
    categoria: document.getElementById('admin-category').value || null,
  };
}

function resetForm() {
  adminForm.reset();
  editingId = null;
  adminSubmit.textContent = 'Añadir Menú';
  adminCancel.style.display = 'none';
  formTitle.textContent = 'Añadir Menú';
  setEmojiSelection('');
}

function cancelEdit() {
  resetForm();
}

function startEdit(id) {
  const m = menus.find(item => item.id === id);
  if (!m) return;
  editingId = id;
  document.getElementById('admin-name').value = m.nombre;
  document.getElementById('admin-desc').value = m.descripcion;
  document.getElementById('admin-price').value = m.precio;
  document.getElementById('admin-stock').value = m.stock;
  document.getElementById('admin-image').value = m.imagen;
  document.getElementById('admin-category').value = m.categoria || '';
  setEmojiSelection(m.imagen);
  adminSubmit.textContent = 'Guardar Cambios';
  adminCancel.style.display = 'inline-flex';
  formTitle.textContent = 'Editar Menú';
  document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
}

if (adminCancel) adminCancel.addEventListener('click', cancelEdit);

if (adminForm) {
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = getFormData();
    if (!data.nombre || !data.descripcion || isNaN(data.precio) || isNaN(data.stock) || !data.imagen) return;
    try {
      if (editingId) {
        await updateMenu(editingId, data);
      } else {
        await addMenu(data);
      }
      resetForm();
    } catch (err) {
      console.error('Error guardando el menú:', err);
      alert('No se pudo guardar el menú. Revisa la consola para más detalles.');
    }
  });
}

// Delegación de eventos para botones Editar / Eliminar
const tableBody = document.getElementById('admin-table-body');
if (tableBody) {
  tableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    if (btn.classList.contains('admin__btn--edit')) startEdit(id);
    if (btn.classList.contains('admin__btn--delete')) {
      if (confirm('¿Eliminar este menú?')) {
        try {
          await deleteMenu(id);
        } catch (err) {
          console.error('Error eliminando el menú:', err);
          alert('No se pudo eliminar el menú. Revisa la consola para más detalles.');
        }
      }
    }
  });
}

// ---- Inicializar ----
populateCategorySelect();
initEmojiPicker();
loadMenus();
