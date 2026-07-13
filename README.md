### 🏔️E-Commerce-frontend y Backend FujiFoods

Una Plataforma desarrollada para una API REST completa utilizando FastAPI y una aplicación web desarrollada con HTML, CSS y JavaScript que permita documentar, visualizar y consumir la información gestionada por la API. Con la finalidad aplicar conocimientos de desarrollo backend y frontend, así como comprender el funcionamiento de las arquitecturas cliente-servidor mediante la implementación de operaciones CRUD completas.

### Tecnologías utilizadas

🔙 Backend (FastAPI): Responsable de:

- Exponer la API REST
- Gestionar datos
- Implementar CRUD
- Documentación automática

🌐 Frontend (HTML + CSS + JS): Responsable de:

Interfaz de usuario
- Consumo de la API
- Mostrar y manipular datos
- Interacción con formularios y botones

### Instalacion en local
Verifica que tienes Python: Abre una terminal y ejecuta:
python3 --version, Deberías tener Python 3.9 o superior.

Luego instalas en entorno virtual:
python3 -m venv venv
source venv/bin/activate 

Y por ultimo las dependencias:
pip install "fastapi[standard]" pytest validators sqlmodel httpx

### comando para ejecutar Pytest 
pytest -v 

### documentación de endpoints con capturas
<img width="947" height="424" alt="image" src="https://github.com/user-attachments/assets/5037e9a7-9429-4ba2-a317-1a48dc42e63c" />
<img width="1886" height="822" alt="image" src="https://github.com/user-attachments/assets/be8d8848-a45b-4287-8c6a-e3748193ed4d" />

### Historias de usuario 
## HU-01: Ver catálogo de menús

**Como** cliente de FujiFood  
**Quiero** ver todos los menús disponibles en la página principal  
**Para** poder decidir qué plato comprar

**Criterios de aceptación:**
- Al entrar a la página, se muestran las tarjetas de todos los menús disponibles
- Cada tarjeta muestra: emoji representativo, nombre, descripción, precio y stock
- Si el stock es 0, se muestra "Agotado" en rojo
- Si hay stock, se muestra la cantidad disponible en verde
- Si no hay menús, se muestra un mensaje "No hay menús disponibles"

---

## HU-02: Añadir un nuevo menú

**Como** administrador de FujiFood  
**Quiero** añadir un nuevo menú al catálogo  
**Para** ofrecer nuevos platos a los clientes

**Criterios de aceptación:**
- Debo poder rellenar: nombre, descripción, precio, stock y un emoji representativo
- Debo poder elegir un emoji de una cuadrícula visual o escribir uno manualmente
- El formulario debe validar que todos los campos estén completos
- Al guardar, el menú debe aparecer tanto en el catálogo como en la tabla de administración
- Si hay un error del servidor, debo ver una alerta con el mensaje de error

---

## HU-03: Editar un menú existente

**Como** administrador de FujiFood  
**Quiero** poder modificar los datos de un menú ya existente  
**Para** actualizar precios, descripciones o imágenes cuando sea necesario

**Criterios de aceptación:**
- Debo poder hacer clic en "Editar" desde la tabla de administración
- El formulario debe precargarse con los datos actuales del menú
- Debe cambiarse el título del formulario a "Editar Menú"
- Al guardar, los cambios deben reflejarse tanto en el catálogo como en la tabla
- Debe haber un botón "Cancelar" para salir del modo edición sin cambios

---

## HU-04: Eliminar un menú

**Como** administrador de FujiFood  
**Quiero** poder eliminar un menú del catálogo  
**Para** retirar platos que ya no ofrezco

**Criterios de aceptación:**
- Debo poder hacer clic en "Eliminar" desde la tabla de administración
- Debe aparecer un cuadro de confirmación antes de eliminar
- Si confirmo, el menú debe desaparecer del catálogo y de la tabla
- Si el servidor falla, debo ver una alerta con el error

---

## HU-05: Gestionar menús desde el panel de administración

**Como** administrador de FujiFood  
**Quiero** tener un panel de administración con una tabla de todos los menús  
**Para** tener una visión general y gestionarlos rápidamente

**Criterios de aceptación:**
- La tabla debe mostrar: imagen (emoji), nombre, precio, stock y acciones
- Si no hay menús, debe mostrarse "No hay menús registrados"
- Los botones de "Editar" y "Eliminar" deben funcionar correctamente

---

## HU-06: Enviar feedback

**Como** cliente de FujiFood  
**Quiero** poder enviar mi opinión sobre la experiencia  
**Para** compartir sugerencias y ayudar a mejorar el servicio

**Criterios de aceptación:**
- Debo poder ingresar: nombre, correo electrónico, valoración y comentario
- El correo debe validarse con formato correcto
- La valoración debe ser una selección de 1 a 5 estrellas
- Todos los campos deben validarse al perder el foco
- Si envío el formulario correctamente, debo ver "¡Gracias por tu feedback!"

---

## HU-07: Consultar documentación de la API

**Como** desarrollador  
**Quiero** ver la documentación de los endpoints disponibles  
**Para** poder integrarme con la API REST de FujiFood

**Criterios de aceptación:**
- Debe mostrarse una tabla con método HTTP, endpoint, descripción y cuerpo JSON
- Los métodos deben estar coloreados según su tipo (GET, POST, PUT, DELETE)
- Debe cubrir: listar menús, obtener por ID, crear, actualizar y eliminar

---

## HU-08: Persistencia de datos en base de datos

**Como** administrador de FujiFood  
**Quiero** que los menús se guarden en una base de datos SQLite  
**Para** que los datos no se pierdan al recargar la página o reiniciar el servidor

**Criterios de aceptación:**
- Los menús deben persistir entre reinicios del servidor
- La base de datos debe crearse automáticamente al iniciar el backend
- Cada menú debe tener: id autoincremental, nombre, descripción, precio, stock e imagen.


### Tablero Kanban
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/12061f23-5df2-4825-b8ea-76eee6460ea6" />

### Prototipo de la interfaz (Stitch).

https://stitch.withgoogle.com/projects/15915482453594483079

### Diagrama de Arquitectura Hexagonal de la API

```
                           ┌───────────────────────┐
                           │       Usuario         │
                           └───────────┬───────────┘
                                       │
                                       ▼
                    ┌────────────────────────────────┐
                    │            Frontend            │
                    │ HTML5 • CSS3 • JavaScript      │
                    │ Consumo de API con Axios       │
                    └───────────────┬────────────────┘
                                    │
                               HTTP Requests
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Adaptadores de Entrada                          │
│                                                                             │
│                    FastAPI (Controllers / Endpoints REST)                   │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Capa de Aplicación                              │
│                                                                             │
│                            Casos de Uso (Use Cases)                         │
│                                                                             │
│  • Crear Producto                                                           │
│  • Obtener Productos                                                        │
│  • Actualizar Producto                                                      │
│  • Eliminar Producto                                                        │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Dominio (Core)                                 │
│                                                                             │
│  Entidad: Producto                                                          │
│  Reglas de negocio                                                          │
│  Interfaces (Puertos)                                                       │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Adaptadores de Salida                           │
│                                                                             │
│                   Repositorio (SQLModel / SQLite)                           │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼
                       ┌─────────────────────┐
                       │    Base de Datos    │
                       │       SQLite        │
                       └─────────────────────┘
```

## Flujo de funcionamiento

1. El usuario interactúa con el frontend.
2. El frontend envía solicitudes HTTP mediante Axios.
3. FastAPI recibe la petición a través de los controladores.
4. El controlador delega la operación al caso de uso correspondiente.
5. El caso de uso aplica la lógica de negocio utilizando las entidades del dominio.
6. Si es necesario acceder a los datos, utiliza un puerto (interfaz) que es implementado por el repositorio.
7. El repositorio consulta o modifica la base de datos SQLite.
8. La respuesta vuelve por el mismo flujo hasta mostrarse en el frontend.








