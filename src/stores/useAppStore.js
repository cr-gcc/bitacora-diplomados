import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    loadingApp: false,
  }),

  actions: {
    showSplash() {
      this.loadingApp = true;
    },
    hideSplash() {
      this.loadingApp = false;
    },
  },
});
