import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      localStorage.setItem("user", JSON.stringify(userData)); // clave separada para usuario
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    logout() {
      this.$reset();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  persist: false,
});
