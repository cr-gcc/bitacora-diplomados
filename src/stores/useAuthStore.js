import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    async fetchUser() {
      try {
        const res = await api.get("/me");
        this.user = res.data;
      } catch (e) {
        this.user = null;
      }
    },

    setUser(user) {
      this.user = user;
    },

    logout() {
      this.user = null;
    },
  },
});
