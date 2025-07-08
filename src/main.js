import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { usePageTitleStore } from '@/stores/usePageTitleStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const pageStore = usePageTitleStore();

router.afterEach((to) => {
  if (to.meta.title) {
    pageStore.setTitle(to.meta.title);
  }
});

app.mount('#app');