<template>
  <div class="space-y-4 bg-gray-300">
    <h2 class="text-4xl px-6 py-4 font-semibold" :class="textColor">{{ title }}</h2>
  </div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';

  const pageThemeStore = usePageThemeStore();
  const { title, textColor } = storeToRefs(pageThemeStore);
</script>