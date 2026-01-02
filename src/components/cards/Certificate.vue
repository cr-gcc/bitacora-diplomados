<template>
  <div v-for="item in items" :key="item.id"
    class="rounded-xl shadow-lg p-4 bg-gradient-to-br from-gray-300 to-gray-500 border-t-4" :class="'border-'+item.color">
    <h3 class="text-xl font-semibold mb-2" :class="'text-'+item.color">{{ item.name }}</h3>
    <div class="flex gap-6 mb-4">
      <div class="flex-1 flex flex-col items-center">
        <a :href="item.public_url" target="_blank" rel="noopener noreferrer">
          <i class="text-7xl mb-4" :class="[item.icon, 'text-'+item.color]"></i>
        </a>
        <p class="text-center" :class="'text-'+item.color">Ir a la Plataforma</p>
      </div>
      <div class="flex-1 flex flex-col items-center">
        <RouterLink :to="item.local_url">
          <i class="text-7xl mb-4 fa-solid fa-clipboard" :class="'text-'+item.color"></i>
        </RouterLink>
        <p class="text-center" :class="'text-'+item.color">Registrar Diplomado</p>
      </div>
    </div>
  </div>
</template>
<script setup>
  defineProps({
    items: {
      type: Array,
      required: true
    }
  })
  
</script>