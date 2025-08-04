<template>
  <div v-if="certificates.length>0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="cert in certificates" :key="cert.id"
      class="rounded-xl shadow-lg p-4 bg-gradient-to-br from-gray-300 to-gray-500 border-t-4" :class="'border-'+cert.color">
      <h3 class="text-xl font-semibold mb-2" :class="'text-'+cert.color">{{ cert.name }}</h3>
      <div class="flex gap-6 mb-4">
        <div class="flex-1 flex flex-col items-center">
          <a :href="cert.public_url" target="_blank" rel="noopener noreferrer">
            <i class="text-7xl mb-4" :class="[cert.icon, 'text-'+cert.color]"></i>
          </a>
          <p class="text-center" :class="'text-'+cert.color">Ir a la Plataforma</p>
        </div>
        <div class="flex-1 flex flex-col items-center">
          <RouterLink :to="cert.local_url">
            <i class="text-7xl mb-4 fa-solid fa-clipboard" :class="'text-'+cert.color"></i>
          </RouterLink>
          <p class="text-center" :class="'text-'+cert.color">Registrar Diplomado</p>
        </div>
      </div>
    </div>
  </div>
  <SplashScreen :isLoadingSS="loading" />
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useTitleStore } from '@/stores/useTitleStore';

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpoint = import.meta.env.VITE_CERTIFICATES;
  const url = `${apiBaseUrl}${endpoint}`;
  const titleStore = useTitleStore();
  const certificates = ref([]);
  const loading = ref(false);
  const error = ref(null);

  titleStore.setColorTitle('Diplomados', 'slate-900');

  const getCertificates = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      certificates.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los certificados';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    getCertificates();
  });

</script>
