# FujiFood — E-Commerce Frontend

Frontend de catálogo de comida asiática. Aplicación web estática que consume una API REST para mostrar productos y administrar el catálogo.

## Estructura del proyecto

```
├── public/                 # Archivos HTML públicos
│   ├── index.html          # Landing page — catálogo + feedback
│   └── admin.html          # Panel de administración CRUD
├── src/                    # Código fuente
│   ├── css/
│   │   └── style.css       # Sistema de diseño completo (909 líneas)
│   └── js/
│       ├── helpers.js      # Configuración compartida (API, categorías, cliente HTTP)
│       ├── script.js       # Lógica del catálogo público
│       └── admin.js        # Lógica del panel de administración
├── docs/
│   ├── README.md           # Este archivo
│   └── designe.md          # Documentación del sistema de diseño
└── .vscode/
    └── settings.json       # Live Server puerto 5501
```

## Requisitos

- Navegador web moderno
- Backend REST corriendo en `http://localhost:8000` (no incluido en este repo)

## Uso

1. Abrí `public/index.html` en tu navegador o usá Live Server desde VS Code
2. El catálogo carga los menús desde la API automáticamente
3. `public/admin.html` permite crear, editar y eliminar menús

## API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/menus` | Listar todos los menús |
| GET | `/api/menus/{id}` | Obtener menú por ID |
| POST | `/api/menus` | Crear menú |
| PUT | `/api/menus/{id}` | Actualizar menú |
| DELETE | `/api/menus/{id}` | Eliminar menú |

## Tecnologías

- HTML5 / CSS3 / JavaScript vanilla
- Google Fonts (Noto Serif + Plus Jakarta Sans)
- Sin frameworks ni dependencias externas
