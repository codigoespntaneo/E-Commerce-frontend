 // ---- CRUD: estado compartido ----
    let menus = [
      { id: 1, nombre: 'Sushi Set Premium', descripcion: '12 piezas de nigiri y maki seleccionados por el chef.', precio: 28.50, stock: 15, imagen: '🍣' },
      { id: 2, nombre: 'Ramen Tonkotsu', descripcion: 'Caldo de cerdo cocido 18h, fideos artesanales, huevo marinado.', precio: 16.90, stock: 20, imagen: '🍜' },
      { id: 3, nombre: 'Bibimbap Clásico', descripcion: 'Arroz coreano con verduras salteadas, carne y huevo.', precio: 14.50, stock: 10, imagen: '🍚' },
      { id: 4, nombre: 'Pad Thai', descripcion: 'Tallarines de arroz salteados con gambas, cacahuete y tamarindo.', precio: 13.90, stock: 18, imagen: '🍝' },
      { id: 5, nombre: 'Gyoza de Cerdo', descripcion: 'Empanadillas japonesas grilladas, salsa ponzu casera.', precio: 9.50, stock: 25, imagen: '🥟' },
      { id: 6, nombre: 'Tarta Matcha', descripcion: 'Bizcocho de té verde japonés con crema de queso.', precio: 8.90, stock: 8, imagen: '🍵' }
    ];
    let nextId = 7;
    let editingId = null;

    // ---- Render: Catálogo público ----
    function renderCatalog() {
      const container = document.getElementById('catalog-container');
      container.innerHTML = menus.map(m => `
        <article class="card">
          <div class="card__image"><span class="card__emoji">${m.imagen}</span></div>
          <div class="card__body">
            <h3 class="card__title">${m.nombre}</h3>
            <p class="card__desc body-md">${m.descripcion}</p>
            <div class="card__meta">
              <span class="card__price">$${m.precio.toFixed(2)}</span>
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
          <td>$${m.precio.toFixed(2)}</td>
          <td>${m.stock}</td>
          <td class="admin__cell-actions">
            <button class="admin__btn admin__btn--edit" data-id="${m.id}">Editar</button>
            <button class="admin__btn admin__btn--delete" data-id="${m.id}">Eliminar</button>
          </td>
        </tr>
      `).join('');
    }

    // ---- CRUD operations ----
    function addMenu(data) {
      const menu = { id: nextId++, ...data };
      menus.push(menu);
      syncUI();
    }

    function updateMenu(id, data) {
      const idx = menus.findIndex(m => m.id === id);
      if (idx !== -1) {
        menus[idx] = { ...menus[idx], ...data };
        syncUI();
      }
    }

    function deleteMenu(id) {
      menus = menus.filter(m => m.id !== id);
      if (editingId === id) cancelEdit();
      syncUI();
    }

    function syncUI() {
      renderCatalog();
      renderAdminTable();
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
        imagen: document.getElementById('admin-image').value.trim()
      };
    }

    function resetForm() {
      adminForm.reset();
      editingId = null;
      adminSubmit.textContent = 'Añadir Menú';
      adminCancel.style.display = 'none';
      formTitle.textContent = 'Añadir Menú';
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
      adminSubmit.textContent = 'Guardar Cambios';
      adminCancel.style.display = 'inline-flex';
      formTitle.textContent = 'Editar Menú';
      document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
    }

    adminCancel.addEventListener('click', cancelEdit);

    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data.nombre || !data.descripcion || isNaN(data.precio) || isNaN(data.stock) || !data.imagen) return;
      if (editingId) {
        updateMenu(editingId, data);
      } else {
        addMenu(data);
      }
      resetForm();
    });

    // Delegación de eventos para botones Editar / Eliminar
    document.getElementById('admin-table-body').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = parseInt(btn.dataset.id, 10);
      if (btn.classList.contains('admin__btn--edit')) startEdit(id);
      if (btn.classList.contains('admin__btn--delete')) {
        if (confirm('¿Eliminar este menú?')) deleteMenu(id);
      }
    });

    // ---- Inicializar ----
    syncUI();

    // ---- Feedback form validation ----
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackFields = [
      { id: 'feedback-name', errorId: 'name-error', validate: v => v.trim() !== '' },
      { id: 'feedback-email', errorId: 'email-error', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'feedback-rating', errorId: 'rating-error', validate: v => v !== '' },
      { id: 'feedback-message', errorId: 'message-error', validate: v => v.trim() !== '' }
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