<template>
  <div v-if="diploma">
    <!--
      <h2 :class="diploma.color">{{ diploma.title }}</h2>
      <p>ID del diplomado: {{ diploma.id }}</p>
    -->
  </div>
  <div v-else>
    <p>Diploma no encontrado.</p>
  </div>
</template>

<script setup>
  import { useRoute } from 'vue-router';
  import { useDiplomaStore } from '@/stores/useDiplomaStore';
  import { usePageTitleStore } from '@/stores/usePageTitleStore';
  import { onMounted, ref } from 'vue';

  const route = useRoute();
  const diplomaStore = useDiplomaStore();
  const pageStore = usePageTitleStore();

  const diploma = ref(null);

  onMounted(() => {
    const slug = route.params.slug;
    diploma.value = diplomaStore.getDiplomaBySlug(slug);

    if (diploma.value) {
      pageStore.setTitleAndColor(diploma.value.title, diploma.value.color);
    } 
    else {
      pageStore.setTitleAndColor('Diplomado no encontrado', 'text-red-700');
    }
  });
</script>
