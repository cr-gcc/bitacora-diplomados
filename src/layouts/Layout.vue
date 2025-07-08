<template>
  <div class="min-h-screen flex flex-col">
    <Header/>
    <Title/>
    <main class="flex-1 p-4 bg-gray-200">
      <div class="space-y-4 px-4 py-6">
        <slot />
      </div>
    </main>
    <Footer/>
  </div>
</template>
<script setup>
  import Header from '@/components/Header.vue';
  import Title from '@/components/Title.vue';
  import Footer from '@/components/Footer.vue';
</script>