import { defineStore } from "pinia";
import { ref } from "vue";

export const useTitleStore = defineStore("titleStore", () => {
  const title = ref("Default");
  const color = ref("text-gray-800");

  function setTitle(newTitle) {
    title.value = newTitle;
  }

  function setColor(newColor) {
    color.value = newColor;
  }

  function setColorTitle(newTitle, newColor) {
    title.value = newTitle;
    color.value = newColor;
  }

  return {
    title,
    color,
    setTitle,
    setColor,
    setColorTitle,
  };
});
