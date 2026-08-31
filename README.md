<div align="center">

# 📋 Bitácora de Diplomados

### Sistema de Administración y Seguimiento de Diplomados en Línea

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0-F7D336?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Axios](https://img.shields.io/badge/Axios-1.10-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

</div>

---

## 📌 Descripción del Proyecto

**Bitácora de Diplomados** es una aplicación web SPA (Single Page Application) diseñada para la **gestión integral de diplomados en línea**. Permite a instituciones educativas administrar de manera centralizada sus programas académicos, módulos, grupos, profesores y alumnos, con soporte para reportes estadísticos y exportación de datos.

> Desarrollada como frontend desacoplado que consume una API REST, implementando patrones modernos de arquitectura frontend con Vue 3, Pinia y Vue Router.

---

## ✨ Funcionalidades Principales

| Módulo | Descripción |
|---|---|
| 🗓️ **Calendario** | Visualización de cursos por mes y año con navegación dinámica |
| 📚 **Diplomados** | CRUD completo de programas, grupos y módulos |
| 👨‍🏫 **Profesores** | Gestión de docentes con búsqueda, filtros y control de estatus |
| 📊 **Estadísticas** | Reportes de alumnos, recursadores y totales por grupo/fechas |
| 👤 **Usuarios** | Administración de accesos y roles del sistema |
| 🔐 **Autenticación** | Login seguro con sesión persistente en localStorage |

---

## 🛠️ Stack Tecnológico

### Frontend Core

```
Vue 3.5          →  Composition API + <script setup>
Vite 7.0         →  Build tool ultrarrápido con HMR
Vue Router 4.5   →  Navegación con guards de autenticación
Pinia 3.0        →  State management reactivo
Tailwind CSS 4.1 →  Utility-first CSS con integración nativa en Vite
Axios 1.10       →  Cliente HTTP con instancia centralizada
```

### Herramientas de Desarrollo

```
@vitejs/plugin-vue   →  Soporte oficial de Vue en Vite
pinia-persistedstate →  Persistencia de estado en localStorage
path alias (@/)      →  Imports limpios desde /src
```

---

## 🏗️ Arquitectura del Proyecto

```
bitacora-diplomados/
│
├── src/
│   ├── assets/              # Recursos estáticos
│   ├── components/          # Componentes reutilizables
│   │   ├── accordions/      #   Acordeones de grupos/cursos
│   │   ├── calendar/        #   Componentes del calendario
│   │   ├── cards/           #   Tarjetas de información
│   │   ├── modals/          #   Modales de CRUD (Add/Edit)
│   │   ├── navigation/      #   Header y Footer
│   │   └── ui/              #   Elementos UI genéricos
│   │
│   ├── layouts/             # Layouts de página (con/sin nav)
│   ├── plugins/             # Configuración de Axios (instancia global)
│   ├── router/              # Vue Router + Navigation Guards
│   ├── stores/              # Stores de Pinia
│   │   ├── useAuthStore     #   Estado de autenticación + persistencia
│   │   ├── useAppStore      #   Estado global (loading, etc.)
│   │   └── usePageThemeStore#   Tema dinámico por módulo
│   ├── styles/              # Estilos globales y utilitarios
│   ├── utils/               # Funciones utilitarias (dateFormat, etc.)
│   └── views/               # Vistas principales (páginas)
│       ├── Login.vue
│       ├── Calendar.vue
│       ├── Certificates.vue
│       ├── Certificate.vue
│       ├── Professors.vue
│       ├── Statistics.vue
│       └── Users.vue
│
├── public/                  # Assets públicos
├── index.html               # Entry point HTML
├── vite.config.js           # Configuración Vite + Tailwind + alias
└── .env                     # Variables de entorno
```

---

## ⚙️ Patrones y Decisiones de Arquitectura

### 🔐 Autenticación con Guards de Ruta

El router implementa un `beforeEach` global que protege todas las rutas privadas verificando el estado de autenticación en Pinia. La sesión se valida contra la API en cada carga de app (`fetchUser()`).

```js
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next("/login");
  } else if (to.path === "/login" && auth.isLoggedIn) {
    next("/");
  } else {
    next();
  }
});
```

### 🗂️ State Management con Pinia

- **`useAuthStore`** — Maneja el usuario autenticado, roles y persistencia en `localStorage`. Expone getters reactivos como `isLoggedIn` y `hasRole(role)`.
- **`useAppStore`** — Controla estados globales como el indicador de carga (`loadingApp`).
- **`usePageThemeStore`** — Aplica un tema de color dinámico por módulo, permitiendo personalización visual por sección.

### 🌐 Cliente HTTP Centralizado

Instancia de Axios configurada con `baseURL` desde variables de entorno, lo que facilita el cambio entre ambientes (desarrollo, staging, producción) sin modificar código.

### 📦 Layout System

Soporte de múltiples layouts mediante metadatos de ruta (`meta.layout`), permitiendo páginas sin navegación (Login) y páginas con layout completo de forma declarativa.

### 📥 Exportación de Datos

El módulo de estadísticas implementa descarga de reportes en formato **Excel (.xlsx)** directamente desde la API, manejando blobs de forma programática con resolución automática del nombre de archivo desde headers HTTP.

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x
- API REST corriendo (ver configuración de entorno)

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/cr-gcc/bitacora-diplomados.git
cd bitacora-diplomados

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 📡 Integración con API REST

La aplicación está diseñada como **frontend desacoplado**. Consume una API REST con los siguientes recursos principales:

- `GET /me` — Verificación de sesión activa
- `GET|POST /certificates` — Gestión de diplomados
- `GET|POST /groups/{id}/search` — Búsqueda de grupos por diplomado
- `POST /statistics/courses` — Consulta de estadísticas
- `POST /statistics/courses/download` — Exportación a Excel
- `GET|POST /professors` — Gestión de profesores

---

<div align="center">

Desarrollado con ❤️ para la gestión educativa de diplomados en línea

</div>