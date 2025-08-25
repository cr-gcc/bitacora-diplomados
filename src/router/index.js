import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Certificate from "@/views/Certificate.vue";
import Professors from "@/views/Professors.vue";
import Statistics from "@/views/Statistics.vue";

const routes = [
  {
    path: "/login",
    component: Login,
    meta: {
      layout: "none",
      requiresAuth: false,
    },
  },
  {
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:slug",
    component: Certificate,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/diplomados",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profesores",
    component: Professors,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/estadisticas",
    component: Statistics,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory("/cedigec/bitacora-diplomados/"),
  routes,
});

router.beforeEach((to, from, next) => {
  //   Dato del usuario API
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");
  //const userRoles = auth?.user?.roles || [];

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Ruta requiere autenticación pero NO está autenticado
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    // Si está autenticado y quiere entrar a login, redirige a home
    next("/");
  } else {
    // Si no se da ningún caso anterior, sigue normal
    next();
  }
});

export default router;
