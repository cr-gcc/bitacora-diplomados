<template>
  <div>
    <SplashScreen v-if="loadingApp" />
    <component :is="layoutComponent">
      <router-view />
    </component>
    <Styles />
  </div>
</template>
<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAppStore } from "@/stores/useAppStore";
  import { storeToRefs } from "pinia";
  import SplashScreen from "@/components/SplashScreen.vue";
  import Layout from '@/layouts/Layout.vue';
  import Styles from '@/components/Styles.vue';

  const route = useRoute();
  
  const app = useAppStore();
  const { loadingApp } = storeToRefs(app);
  
  const layoutComponent = computed(() => {
    return route.meta.layout === 'none' ? 'div' : Layout;
  });
</script>
