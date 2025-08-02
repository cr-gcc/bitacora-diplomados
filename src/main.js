import { createApp } from "vue";
import { createPinia } from "pinia";
import { usePageTitleStore } from "@/stores/usePageTitleStore";
import App from "./App.vue";
import router from "./router";
import piniaPersistedState from "pinia-plugin-persistedstate";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(piniaPersistedState);
app.use(router);

// Usa el hook después de que la app ya tenga Pinia y router
router.afterEach((to) => {
  const pageStore = usePageTitleStore();
  // Si la ruta tiene título y color, los actualizamos en el store
  if (to.meta.title && to.meta.color) {
    pageStore.setTitleAndColor(to.meta.title, to.meta.color);
  }
});

app.mount("#app");
