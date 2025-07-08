<template>
  <div class="space-y-4 bg-gray-300">
    <h2 class="text-4xl px-6 py-4 font-semibold" :class="colorTitle">{{ pageTitle  }}</h2>
  </div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { usePageTitleStore } from '@/stores/usePageTitleStore';

  const pageStore = usePageTitleStore();
  const { title: pageTitle, color: colorTitle } = storeToRefs(pageStore);
</script>