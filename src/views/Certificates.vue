<template>
  <div v-if="certificates.length>0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Certificate :items="certificates" />
  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { useAppStore } from '@/stores/useAppStore';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import Certificate from '@/components/cards/Certificate.vue';
  import api from '@/plugins/axios';  

  const endpoint = import.meta.env.VITE_CERTIFICATES;
  const url = `${endpoint}`;
  const app = useAppStore()
  const pageThemeStore = usePageThemeStore();
  const certificates = ref([]);
  const error = ref(null);

  pageThemeStore.setPageTheme('Diplomados', 'slate-900');

  const getCertificates = async () => {
    app.loadingApp = true;
    error.value = null;
    try {
      const response = await api.get(url);
      certificates.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los certificados';
    } finally {
      app.loadingApp = false;
    }
  };

  onMounted(() => {
    getCertificates();
  });

</script>
