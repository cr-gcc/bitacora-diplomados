import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

import SplashScreen from "@/components/SplashScreen.vue";

import "./style.css";

// --- Crear instancia de Vue ---
const app = createApp(App);

// --- Configurar Pinia + Persistencia ---
const pinia = createPinia();
pinia.use(piniaPersistedState);

// --- Registrar Componentes Globales ---
app.component("SplashScreen", SplashScreen);

// --- Usar Plugins ---
app.use(pinia);
app.use(router);

// --- Montar la App ---
app.mount("#app");
