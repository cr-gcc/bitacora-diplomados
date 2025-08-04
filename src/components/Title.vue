<template>
  <div class="space-y-4 bg-gray-300">
    <h2 class="text-4xl px-6 py-4 font-semibold" :class="'text-'+color">{{ title }}</h2>
  </div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { useTitleStore } from '@/stores/useTitleStore';

  const titleStore = useTitleStore();
  const { title, color } = storeToRefs(titleStore);
</script>