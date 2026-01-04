<template>
  <div class="flex justify-end gap-4">
    <div class="flex items-center gap-1">
      <p>Fecha Actual <i class="fa-solid fa-square text-sky-900"></i></p>
    </div>
    <div class="flex items-center gap-1">
      <p>Inicio Cursos <i class="fa-solid fa-square text-gray-700"></i></p>
    </div>
  </div>
  <div v-if="error" class="mb-2">
    <p class="text-red-700">{{ error }}</p>
  </div>
  <Calendar @day-selected="openModal" />
  <Scheadule v-model="scheaduleModal" :date="date"/>
</template>
<script setup>
  import { ref } from 'vue'
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import Calendar from '@/components/calendar/Calendar.vue';
  import Scheadule from '@/components/modals/calendar/Scheadule.vue';

  const pageThemeStore = usePageThemeStore();
  const scheaduleModal = ref(false);
  const error = ref(null);
  const date = ref(null);
  
  pageThemeStore.setPageTheme('Home', 'sky-900');

  const openModal = ({ day, month, year }) => {
    scheaduleModal.value = true;
    date.value = { day, month, year };
  };
</script>
