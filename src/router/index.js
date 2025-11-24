import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Certificates from "@/views/Certificates.vue";
import Certificate from "@/views/Certificate.vue";
import Professors from "@/views/Professors.vue";
import Statistics from "@/views/Statistics.vue";
import Users from "@/views/Users.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";

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
    path: "/forgot-password",
    component: ForgotPassword,
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
    component: Certificates,
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
  {
    path: "/usuarios",
    component: Users,
    meta: {
      requiresAuth: true,
    },
  },
];

const base = import.meta.env.VITE_BASE_URL || "/";
const router = createRouter({
  history: createWebHistory(base),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // Ruta requiere autenticación pero NO está autenticado
    next("/login");
  } else if (to.path === "/login" && auth.isLoggedIn) {
    // Si está autenticado y quiere entrar a login, redirige a home
    next("/");
  } else {
    // Si no se da ningún caso anterior, sigue normal
    next();
  }
});

export default router;
