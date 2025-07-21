import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import api from './plugins/axios';
import { usePageTitleStore } from '@/stores/usePageTitleStore';

const app = createApp(App);
const pinia = createPinia();

// disponible como this.$api en components
app.config.globalProperties.$api = api;

app.use(pinia);
app.use(router);

// Usa el hook después de que la app ya tenga Pinia y router
router.afterEach((to) => {
  const pageStore = usePageTitleStore();
  // Si la ruta tiene título y color, los actualizamos en el store
  if (to.meta.title && to.meta.color) {
    pageStore.setTitleAndColor(to.meta.title, to.meta.color);
  }
});

app.mount('#app');
