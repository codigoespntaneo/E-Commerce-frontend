// ---- Estado compartido ----
let menus = [];
let selectedCategory = null;

// ---- Render: Categorías ----
function renderCategories() {
  const container = document.getElementById('category-tabs');
  if (!container) return;
  container.innerHTML = `
    <button class="category-tab category-tab--all ${selectedCategory === null ? 'category-tab--active' : ''}" data-category="">
      <span class="category-tab__icon">⊞</span>
      <span class="category-tab__label">Todas</span>
    </button>
    ${CATEGORIES.map(c => `
      <button class="category-tab ${selectedCategory === c.id ? 'category-tab--active' : ''}" data-category="${c.id}">
        <span class="category-tab__icon">${c.emoji}</span>
        <span class="category-tab__label">${c.nombre}</span>
      </button>
    `).join('')}
  `;
}

function initCategoryTabs() {
  const container = document.getElementById('category-tabs');
  if (!container) return;
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-tab');
    if (!btn) return;
    selectedCategory = btn.dataset.category || null;
    renderCategories();
    renderCatalog();
  });
}

// ---- Render: Catálogo público ----
function renderCatalog() {
  const container = document.getElementById('catalog-container');
  const filtered = selectedCategory
    ? menus.filter(m => m.categoria === selectedCategory)
    : menus;
  if (filtered.length === 0) {
    container.innerHTML = '<p class="admin__empty" style="display:block">No hay menús en esta categoría.</p>';
    return;
  }
  container.innerHTML = filtered.map(m => `
    <article class="card">
      <div class="card__image"><img class="card__img" src="${m.imagen}" alt="${m.nombre}" loading="lazy" /></div>
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

// ---- Carga del catálogo ----
async function loadCatalog() {
  try {
    menus = await api.list();
    initCategoryTabs();
    renderCategories();
    renderCatalog();
  } catch (err) {
    console.error('No se pudieron cargar los menús:', err);
    const container = document.getElementById('catalog-container');
    if (container) {
      container.innerHTML = `<p class="admin__empty" style="display:block">No se pudo conectar con la API (${API_BASE}).</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', loadCatalog);
