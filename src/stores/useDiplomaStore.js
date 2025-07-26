import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDiplomaStore = defineStore('diplomas', () => {
  const diplomas = ref([
    {
      id: 1,
      title: 'Auditoria Interna',
      textColor: 'text-pink-950',
      borderColor: 'border-pink-950',
      color: 'bg-pink-950',
      icon: 'fa-solid fa-users',
      url: import.meta.env.VITE_AI_URL,
      localUrl: '/auditoria-intena'
    },
    {
      id: 2,
      title: 'Comercio Electrónico',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-600',
      color: 'bg-blue-600',
      icon: 'fa-solid fa-cart-shopping',
      url: import.meta.env.VITE_CE_URL,
      localUrl: '/comercio-electronico'
    },
    {
      id: 3,
      title: 'Finanzas',
      textColor: 'text-yellow-900',
      borderColor: 'border-yellow-900',
      color: 'bg-yellow-900',
      icon: 'fa-solid fa-money-bill-1-wave',
      url: import.meta.env.VITE_FI_URL,
      localUrl: '/finanzas'
    },
    {
      id: 4,
      title: 'Mercadotecnia',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-600',
      color: 'bg-yellow-600',
      icon: 'fa-solid fa-volume-high',
      url: import.meta.env.VITE_ME_URL,
      localUrl: '/mercadotecnia'
    },
    {
      id: 5,
      title: 'Talento Humano',
      textColor: 'text-lime-900',
      borderColor: 'border-lime-900',
      color: 'bg-lime-900',
      icon: 'fa-solid fa-person',
      url: import.meta.env.VITE_TH_URL,
      localUrl: '/talento-humano'
    },
    {
      id: 6,
      title: 'Tecnologías de la Información y Comunicación',
      textColor: 'text-blue-950',
      borderColor: 'border-blue-950',
      color: 'bg-blue-950',
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