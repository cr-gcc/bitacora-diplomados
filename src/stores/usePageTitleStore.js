import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePageTitleStore = defineStore('page', () => {
  const title = ref('');
  const color = ref('');

  const setTitleAndColor = (newTitle, newColor) => {
    title.value = newTitle;
    color.value = newColor;
  };

  return { title, color, setTitleAndColor };
});