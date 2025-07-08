import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Record from '@/views/Record.vue';
import About from '@/views/About.vue';

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { layout: 'none' }
  },
  {
    path: '/',
    component: Home,
    meta: { title: 'Diplomados', color: 'text-slate-900' }
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

export default router;