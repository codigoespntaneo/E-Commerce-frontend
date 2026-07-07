// ---- Configuración de la API ----
const API_BASE = 'http://localhost:8000';

// ---- Estado compartido ----
let menus = [];
let editingId = null;

// ---- Adaptador ES ↔ EN (mapea campos del form en español al contrato del backend en inglés) ----
const toBackend = (m) => ({
  name:        m.nombre,
  description: m.descripcion,
  price:       m.precio,
  stock:       m.stock,
  img:         m.imagen,
});

const fromBackend = (m) => ({
  id:          m.id,
  nombre:      m.name,
  descripcion: m.description,
  precio:      Number(m.price),
  stock:       m.stock,
  imagen:      m.img ?? '',
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

// ---- Render: Catálogo público ----
function renderCatalog() {
  const container = document.getElementById('catalog-container');
  if (menus.length === 0) {
    container.innerHTML = '<p class="admin__empty" style="display:block">No hay menús disponibles.</p>';
    return;
  }
  container.innerHTML = menus.map(m => `
    <article class="card">
      <div class="card__image"><span class="card__emoji">${m.imagen}</span></div>
      <div class="card__body">
        <h3 class="card__title">${m.nombre}</h3>
        <p class="card__desc body-md">${m.descripcion}</p>
        <div class="card__meta">
          <span class="card__price">$${Number(m.precio).toFixed(2)}</span>
          <span class="card__stock label-caps ${m.stock > 0 ? 'card__stock--available' : 'card__stock--empty'}">
            ${m.stock > 0 ? `${m.stock} uds.` : 'Agotado'}
          </span>
        </div>
      </div>
    </article>
  `).join('');
}

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
  tbody.innerHTML = menus.map(m => `
    <tr>
      <td class="admin__cell-img">${m.imagen}</td>
      <td><strong>${m.nombre}</strong></td>
      <td>$${Number(m.precio).toFixed(2)}</td>
      <td>${m.stock}</td>
      <td class="admin__cell-actions">
        <button class="admin__btn admin__btn--edit" data-id="${m.id}">Editar</button>
        <button class="admin__btn admin__btn--delete" data-id="${m.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function syncUI() {
  renderCatalog();
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
    container.innerHTML = `<p class="admin__empty" style="display:block">No se pudo conectar con la API (${API_BASE}). Revisa que el backend esté en ejecución.</p>`;
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
  // Platos principales
  '🍣', '🍱', '🍜', '🍲', '🍛', '🍝', '🥟', '🥢',
  // Arroz / fideos / sopas
  '🍚', '🍢', '🥠', '🍙', '🍘',
  // Postres y dulces
  '🍡', '🍮', '🍰', '🍵', '🧋',
  // Carnes y proteínas
  '🍤', '🍗', '🥩', '🍖', '🥚',
  // Verduras y frescos
  '🥗', '🥬', '🌶️', '🥒', '🧄',
  // Frutas
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

function getFormData() {
  return {
    nombre: document.getElementById('admin-name').value.trim(),
    descripcion: document.getElementById('admin-desc').value.trim(),
    precio: parseFloat(document.getElementById('admin-price').value),
    stock: parseInt(document.getElementById('admin-stock').value, 10),
    imagen: document.getElementById('admin-image').value.trim(),
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
  setEmojiSelection(m.imagen);
  adminSubmit.textContent = 'Guardar Cambios';
  adminCancel.style.display = 'inline-flex';
  formTitle.textContent = 'Editar Menú';
  document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
}

adminCancel.addEventListener('click', cancelEdit);

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

// Delegación de eventos para botones Editar / Eliminar
document.getElementById('admin-table-body').addEventListener('click', async (e) => {
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

// ---- Feedback form validation ----
const feedbackForm = document.getElementById('feedback-form');
const feedbackFields = [
  { id: 'feedback-name', errorId: 'name-error', validate: v => v.trim() !== '' },
  { id: 'feedback-email', errorId: 'email-error', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  { id: 'feedback-rating', errorId: 'rating-error', validate: v => v !== '' },
  { id: 'feedback-message', errorId: 'message-error', validate: v => v.trim() !== '' },
];

function showError(errorId) { document.getElementById(errorId).classList.add('feedback__error--visible'); }
function hideError(errorId) { document.getElementById(errorId).classList.remove('feedback__error--visible'); }
function validateField(field) {
  const input = document.getElementById(field.id);
  const valid = field.validate(input.value);
  if (valid) hideError(field.errorId); else showError(field.errorId);
  return valid;
}

feedbackFields.forEach(f => {
  const input = document.getElementById(f.id);
  input.addEventListener('blur', () => validateField(f));
  input.addEventListener('input', () => {
    if (document.getElementById(f.errorId).classList.contains('feedback__error--visible')) validateField(f);
  });
});

feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const allValid = feedbackFields.every(f => validateField(f));
  if (allValid) {
    document.getElementById('feedback-success').classList.add('feedback__success--visible');
    feedbackForm.reset();
    feedbackFields.forEach(f => hideError(f.errorId));
  }
});

// ---- Inicializar ----
initEmojiPicker();
loadMenus();
