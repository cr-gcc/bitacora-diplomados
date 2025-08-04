<template>
  <div>
    <div v-if="certificate">
      <h3 class="text-3xl mb-2" :class="'text-'+certificate.color">Grupos</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <input
            type="number"
            id="grupo"
            placeholder="Buscar"
            class="w-full rounded px-2 py-1 text-md border"
            :class="'border-'+certificate.color"
          />
        </div>
        <div>
          <button 
            class="bcb-certificate" 
            :class="['border-'+certificate.color, 'bg-'+certificate.color]">
            Finalizados
          </button>
        </div>
        <div>
          <button 
            class="bcb-certificate" 
            :class="['border-'+certificate.color, 'bg-'+certificate.color]">
            Activos
          </button>
        </div>
        <div>
          <button 
            class="bcb-certificate" 
            :class="['border-'+certificate.color, 'bg-'+certificate.color]">
            Todos
          </button>
        </div>
        <div>
          <button 
            class="bcb-certificate" 
            :class="['border-'+certificate.color, 'bg-'+certificate.color]">
            Agregar
          </button>
        </div>
      </div>
      <!--
      <div class="space-y-4">
        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary
            class="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 px-2 py-1 text-white"
            :class="[diploma.borderColor, diploma.color]"
          >
            <h2 class="text-lg font-medium">9501 <span class="bg-green-700 px-2">Activo</span></h2>
            <svg
              class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div>
            <table class="table-auto w-full">
              <thead>
                <tr>
                  <th class="text-left">Inicio</th>
                  <th class="text-left">Fin</th>
                  <th class="text-left">Módulo</th>
                  <th class="text-left">Diplomado</th>
                  <th class="text-left">Profesor</th>
                  <th class="text-left">Opciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr>
                  <td class="py-1">30/06/2025</td>
                  <td class="py-1">16/08/2025</td>
                  <td class="py-1">1</td>
                  <td class="py-1">Entorno de las TICS</td>
                  <td class="py-1">Karla Ivette Ortega Hernandez</td>
                  <td class="py-1">
                    <button :class="['flex items-center gap-1 px-2 py-1 text-xs text-white rounded', diploma.color]">
                      <i class="fa-solid fa-pen"></i>
                      Editar
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="py-1"></td>
                  <td class="py-1"></td>
                  <td class="py-1">2</td>
                  <td class="py-1">Análisis y diseño de sistemas</td>
                  <td class="py-1"></td>
                  <td class="py-1">
                    <button :class="['flex items-center gap-1 px-2 py-1 text-xs text-white rounded', diploma.color]">
                      <i class="fa-solid fa-pen"></i>
                      Editar
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="py-1"></td>
                  <td class="py-1"></td>
                  <td class="py-1">3</td>
                  <td class="py-1">Bases de datos</td>
                  <td class="py-1"></td>
                  <td class="py-1">
                    <button :class="['flex items-center gap-1 px-2 py-1 text-xs text-white rounded', diploma.color]">
                      <i class="fa-solid fa-pen"></i>
                      Editar
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="py-1"></td>
                  <td class="py-1"></td>
                  <td class="py-1">4</td>
                  <td class="py-1">Redes y telecomunicaciones</td>
                  <td class="py-1"></td>
                  <td class="py-1">
                    <button :class="['flex items-center gap-1 px-2 py-1 text-xs text-white rounded', diploma.color]">
                      <i class="fa-solid fa-pen"></i>
                      Editar
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="py-1"></td>
                  <td class="py-1"></td>
                  <td class="py-1">5</td>
                  <td class="py-1">Desarrollo de aplicaciones en internet</td>
                  <td class="py-1"></td>
                  <td class="py-1">
                    <button :class="['flex items-center gap-1 px-2 py-1 text-xs text-white rounded', diploma.color]">
                      <i class="fa-solid fa-pen"></i>
                      Editar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
      -->
      <!--
        <h2 :class="diploma.color">{{ diploma.title }}</h2>
        <p>ID del diplomado: {{ diploma.id }}</p>
      -->
    </div>
    <div v-else>
      <p>{{ error }}</p>
    </div>  
  </div>
  <SplashScreen :isLoadingSS="loading" />
</template>

<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import { useTitleStore } from '@/stores/useTitleStore';

  const titleStore = useTitleStore();
  const route = useRoute();
  const slug = route.params.slug;
  const loading = ref(false);
  const certificate = ref(null);
  const error = ref(null);
  const records = ref([]);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpoint = import.meta.env.VITE_CERTIFICATE;
  const url = `${apiBaseUrl}${endpoint}/${slug}`;

  const getCertificate = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      certificate.value = response.data;
      } catch (e) {
        error.value = e.response?.data?.message || 'Error al cargar el diplomado';
      } finally {
        loading.value = false;
      }
  };

  watch(() => certificate.value, (newVal) => {
    if (newVal.name && newVal.color) {
      titleStore.setColorTitle(newVal.name, newVal.color);
    }
  });

  onMounted(() => {
    getCertificate();
  });
</script>
