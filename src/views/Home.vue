<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="(diploma, index) in diplomas" :key="index"
      class="rounded-xl shadow-lg p-4 bg-gradient-to-br from-gray-300 to-gray-500 border-t-4" :class="diploma.borderColor">
      <h3 class="text-xl font-semibold mb-2" :class="diploma.textColor">{{ diploma.title }}</h3>
      <div class="flex gap-6 mb-4">
        <div class="flex-1 flex flex-col items-center">
          <a :href="diploma.url" target="_blank" rel="noopener noreferrer">
            <i class="text-7xl mb-4" :class="[diploma.icon, diploma.textColor]"></i>
          </a>
          <p class="text-center" :class="diploma.textColor">Ir a la Plataforma</p>
        </div>
        <div class="flex-1 flex flex-col items-center">
          <RouterLink :to="diploma.localUrl">
            <i class="text-7xl mb-4 fa-solid fa-clipboard" :class="diploma.textColor"></i>
          </RouterLink>
          <p class="text-center" :class="diploma.textColor">Registrar Diplomado</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { useDiplomaStore } from '@/stores/useDiplomaStore';
  const diplomaStore = useDiplomaStore();
  const { diplomas } = storeToRefs(diplomaStore);
</script>
