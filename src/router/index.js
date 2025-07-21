import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Record from '@/views/Record.vue';
import About from '@/views/About.vue';

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { 
      layout: 'none',
      requiresAuth: false 
    }
  },
  {
    path: '/',
    component: Home,
    meta: { 
      title: 'Diplomados', 
      color: 'text-slate-900',
      requiresAuth: true 

    }
  },
  {
    path: '/:slug',
    component: Record,
    meta: { title: 'Cargando...', color: 'text-slate-900' }, // título provisional
  },
  { path: '/about', component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  //   Dato del usuario API
  const auth = JSON.parse(localStorage.getItem('auth'));
  const isAuthenticated = !!localStorage.getItem('token');
  const userRoles = auth?.user?.roles || [];
  //  Autenticacion requerida y no esta autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  }
  else if ( (to.path === '/login' && isAuthenticated) || to.path === '/') {
    
  }
  else {
    next();
  }
  
});
export default router;