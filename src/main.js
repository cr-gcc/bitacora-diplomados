import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import piniaPersistedState from "pinia-plugin-persistedstate";
import SplashScreen from "@/components/SplashScreen.vue";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.component("SplashScreen", SplashScreen);
app.use(pinia);
pinia.use(piniaPersistedState);
app.use(router);
app.mount("#app");
