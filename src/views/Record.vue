<template>
  <div>
    <div v-if="diploma">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <input
            type="number"
            id="grupo"
            placeholder="Buscar Grupo"
            :class="['w-full rounded px-2 py-1 text-md border', diploma.borderColor]"
          />
        </div>
        <div>
          <button 
            class="inline-block w-full rounded-sm border px-12 py-1 text-md text-white focus:ring-3 focus:outline-hidden" 
            :class="[diploma.borderColor, diploma.color]">
            Grupos Finalizados
          </button>
        </div>
        <div>
          <button 
            class="inline-block w-full rounded-sm border px-12 py-1 text-md text-white focus:ring-3 focus:outline-hidden" 
            :class="[diploma.borderColor, diploma.color]">
            Grupos Activos
          </button>
        </div>
        <div>
          <button 
            class="inline-block w-full rounded-sm border px-12 py-1 text-md text-white focus:ring-3 focus:outline-hidden" 
            :class="[diploma.borderColor, diploma.color]">
            Agregar Grupo
          </button>
        </div>
      </div>
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
      <!--
        <h2 :class="diploma.color">{{ diploma.title }}</h2>
        <p>ID del diplomado: {{ diploma.id }}</p>
      -->
    </div>
    <div v-else>
      <p>Diploma no encontrado.</p>
    </div>  
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
      pageStore.setTitleAndColor(diploma.value.title, diploma.value.textColor);
    } 
    else {
      pageStore.setTitleAndColor('Diplomado no encontrado', 'text-red-700');
    }
  });
</script>
