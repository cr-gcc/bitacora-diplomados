import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDiplomaStore = defineStore('diplomas', () => {
  const diplomas = ref([
    {
      id: 1,
      title: 'Auditoria Interna',
      color: 'text-pink-950',
      border: 'border-pink-950',
      icon: 'fa-solid fa-users',
      url: 'https://diplomados.fca.unam.mx/auditoria/',
      localUrl: '/auditoria-intena'
    },
    {
      id: 2,
      title: 'Comercio Electrónico',
      color: 'text-blue-600',
      border: 'border-blue-600',
      icon: 'fa-solid fa-cart-shopping',
      url: 'https://diplomados.fca.unam.mx/comercio_electronico/',
      localUrl: '/comercio-electronico'
    },
    {
      id: 3,
      title: 'Finanzas',
      color: 'text-yellow-900',
      border: 'border-yellow-900',
      icon: 'fa-solid fa-money-bill-1-wave',
      url: 'https://diplomados.fca.unam.mx/finanzas/',
      localUrl: '/finanzas'
    },
    {
      id: 4,
      title: 'Mercadotecnia',
      color: 'text-yellow-600',
      border: 'border-yellow-600',
      icon: 'fa-solid fa-volume-high',
      url: 'https://diplomados.fca.unam.mx/mercadotecnia/',
      localUrl: '/mercadotecnia'
    },
    {
      id: 5,
      title: 'Talento Humano',
      color: 'text-lime-900',
      border: 'border-lime-900',
      icon: 'fa-solid fa-person',
      url: 'https://diplomados.fca.unam.mx/talento_humano/',
      localUrl: '/talento-humano'
    },
    {
      id: 6,
      title: 'Tecnologías de la Información y Comunicación',
      color: 'text-blue-950',
      border: 'border-blue-950',
      icon: 'fa-solid fa-server',
      url: 'https://diplomados.fca.unam.mx/tecnologias/',
      localUrl: '/tic'
    }
  ]);

  const getDiplomaBySlug = (slug) => {
    return diplomas.value.find((diploma) => diploma.localUrl === `/${slug}`);
  };

  return { diplomas, getDiplomaBySlug };
});