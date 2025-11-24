import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "@/stores/useAuthStore";
import "./style.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersistedState);
app.use(pinia);

const auth = useAuthStore();

app.use(router);
app.mount("#app");

(async () => {
  await auth.fetchUser();
})();
