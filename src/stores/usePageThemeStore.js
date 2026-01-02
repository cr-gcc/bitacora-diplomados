import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePageThemeStore = defineStore("pageThemeStore", () => {
  // Variables
  const title = ref("Loading...");
  const theme = ref({
    text: 'text-gray-800',
    bg: 'bg-gray-200',
    border: 'border-gray-300',
  });
  // Setters
  function setTitle(newTitle) {
    title.value = newTitle;
  }
  function setTheme(color) {
    theme.value = {
      text: `text-${color}`,
      bg: `bg-${color}`,
      border: `border-${color}`,
    };
  }
  function setPageTheme(newTitle, color) {
    title.value = newTitle;
    setTheme(color);
  }
  // Getters
  const textColor = computed(() => theme.value.text);
  const bgColor = computed(() => theme.value.bg);
  const borderColor = computed(() => theme.value.border);
  //
  return {
    title,
    textColor,
    bgColor,
    borderColor,
    setTitle,
    setPageTheme,
  };
});
