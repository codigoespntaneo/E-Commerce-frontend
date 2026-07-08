// ---- Estado compartido ----
let menus = [];
let editingId = null;

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
      <td class="admin__cell-img"><img class="admin__table-img" src="${m.imagen}" alt="${m.nombre}" /></td>
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

// ---- Vista previa de imagen ----
function initImagePreview() {
  const input = document.getElementById('admin-image');
  const img = document.getElementById('admin-image-img');
  const preview = document.getElementById('admin-image-preview');

  function updatePreview() {
    const url = input.value.trim();
    if (url) {
      img.src = url;
      preview.style.display = 'block';
    } else {
      img.src = '';
      preview.style.display = 'none';
    }
  }

  input.addEventListener('input', updatePreview);
  updatePreview();
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
  document.getElementById('admin-image-preview').style.display = 'none';
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
  document.getElementById('admin-image-img').src = m.imagen;
  document.getElementById('admin-image-preview').style.display = 'block';
  document.getElementById('admin-category').value = m.categoria || '';
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

// ---- API Reference: tabs ----
function initApiTabs() {
  document.querySelectorAll('.api-example__tabs').forEach(tabGroup => {
    tabGroup.addEventListener('click', (e) => {
      const tab = e.target.closest('.api-example__tab');
      if (!tab) return;
      const target = tab.dataset.target;
      const parent = tab.closest('.api-example');
      parent.querySelectorAll('.api-example__tab').forEach(t => t.classList.remove('api-example__tab--active'));
      tab.classList.add('api-example__tab--active');
      parent.querySelectorAll('.api-example__body').forEach(body => body.style.display = 'none');
      document.getElementById(target).style.display = 'block';
    });
  });
}

// ---- Inicializar ----
populateCategorySelect();
initImagePreview();
initApiTabs();
loadMenus();
