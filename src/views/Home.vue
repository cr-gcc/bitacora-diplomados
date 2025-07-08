<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="(diplomado, index) in diplomados" :key="index"
      class="rounded-xl shadow-lg p-4 bg-gradient-to-br from-gray-300 to-gray-500 border-t-4" :class="diplomado.border">
      <h3 class="text-xl font-semibold mb-2" :class="diplomado.color">{{ diplomado.title }}</h3>
      <div class="flex gap-6 mb-4">
        <div class="flex-1 flex flex-col items-center">
          <a :href="diplomado.url" target="_blank" rel="noopener noreferrer">
            <i class="text-7xl mb-4" :class="diplomado.icon+' '+diplomado.color"></i>
          </a>
          <p class="text-center" :class="diplomado.color">Ir a la Plataforma</p>
        </div>
        <div class="flex-1 flex flex-col items-center">
          <RouterLink :to="diplomado.localUrl">
            <i class="text-7xl mb-4 fa-solid fa-clipboard" :class="diplomado.color"></i>
          </RouterLink>
          <p class="text-center" :class="diplomado.color">Registrar Diplomado</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const diplomados = [
  {
    title: 'Auditoria interna',
    description: 'Domina el desarrollo de sitios web y aplicaciones modernas.',
    color: 'text-pink-950',
    border: 'border-pink-950',
    icon: 'fa-solid fa-users',
    url: 'https://diplomados.fca.unam.mx/auditoria/',
    localUrl: '/auditoria-intena'
  },
  {
    title: 'Comercio electrónico',
    description: 'Profundiza en el estudio de la mente y el comportamiento humano.',
    color: 'text-blue-600',
    border: 'border-blue-600',
    icon: 'fa-solid fa-cart-shopping',
    url: 'https://diplomados.fca.unam.mx/comercio_electronico/',
    localUrl: '/comercio-electronico'
  },
  {
    title: 'Finanzas',
    description: 'Aprende estrategias efectivas de marketing y redes sociales.',
    color: 'text-yellow-900',
    border: 'border-yellow-900',
    icon: 'fa-solid fa-money-bill-1-wave',
    url: 'https://diplomados.fca.unam.mx/finanzas/',
    localUrl: '/finanzas'
  },
  {
    title: 'Mercadotecnia',
    description: 'Desarrolla habilidades clave en la gestión financiera empresarial.',
    color: 'text-yellow-600',
    border: 'border-yellow-600',
    icon: 'fa-solid fa-volume-high',
    url: 'https://diplomados.fca.unam.mx/mercadotecnia/',
    localUrl: '/mercadotecnia'
  },
  {
    title: 'Talento humano',
    description: 'Fomenta entornos educativos accesibles y equitativos.',
    color: 'text-lime-900',
    border: 'border-lime-900',
    icon: 'fa-solid fa-person',
    url: 'https://diplomados.fca.unam.mx/talento_humano/',
    localUrl: '/talento-humano'
  },
  {
    title: 'Tecnologías de la información y comunicación',
    description: 'Explora las técnicas y herramientas de diseño visual profesional.',
    color: 'text-blue-950',
    border: 'border-blue-950',
    icon: 'fa-solid fa-server',
    url: 'https://diplomados.fca.unam.mx/tecnologias/',
    localUrl: '/tic'
  }
];
</script>
