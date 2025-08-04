<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
    <div>
      <input
        type="number"
        id="grupo"
        placeholder="Buscar"
        class="w-full rounded px-2 py-1 border border-sky-900"
      />
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900">
        Inactivos
      </button>
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900">
        Activos
      </button>
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900">
        Todos
      </button>
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900">
        Agregar
      </button>
    </div>
  </div>
  <SplashScreen :isLoadingSS="loading" />
</template>
<script setup>
  import { ref } from 'vue'; 
  import { useTitleStore } from '@/stores/useTitleStore';
  import axios from 'axios';

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpoint = import.meta.env.VITE_PROFESSORS;
  const url = `${apiBaseUrl}${endpoint}`;
  const titleStore = useTitleStore();
  const loading = ref(false);
  const error = ref(null);
  const professors = ref([]);
  titleStore.setColorTitle('Profesores', 'sky-900');

  const getProfessors = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      professors.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los certificados';
    } finally {
      loading.value = false;
    }
  };


</script>