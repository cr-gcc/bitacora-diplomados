import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loadingUser: true,
  }),

  persist: {
    storage: localStorage,
    paths: ["user"],
  },

  getters: {
    isLoggedIn: (state) => !!state.user,

    hasRole: (state) => {
      return (role) => {
        return state.user?.roles?.some((r) => r.name === role);
      };
    },
  },

  actions: {
    async fetchUser() {
      this.loadingUser = true;
      try {
        const res = await api.get("/me");
        this.setUser(res.data);
      } catch (err) {
        this.setUser(null);
      } finally {
        this.loadingUser = false;
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
