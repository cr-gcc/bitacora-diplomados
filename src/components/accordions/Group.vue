<template>
  <div v-if="groups.length>0" class="space-y-4">
    <details v-for="group in groups" :key="'indg'+group.id" class="group [&_summary::-webkit-details-marker]:hidden">
      <summary
        :class="[
          'accordion-group cursor-pointer',
          pageThemeStore.borderColor, 
          pageThemeStore.bgColor
        ]">
        <h2 class="text-lg font-medium flex items-center gap-2">
          {{ group.code }} 
          <span v-if="group.status === 'active'" class="bg-green-700 basic-bag"
          >
            Activo
          </span>
          <span v-else-if="group.status === 'inactive'" class="bg-red-700 basic-bag"
          >
            Inactivo
          </span>
          <span v-else class="bg-gray-700 basic-bag">Finalizado</span>
        </h2>
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
      <div class="px-2">
        <div class="flex justify-end gap-2 py-1">
          <button 
            @click="openModal('editGroup')"
            :class="[
              'bo-mini', 
              pageThemeStore.borderColor, 
              pageThemeStore.bgColor
            ]">
            <i class="fa-solid fa-pen mr-0.5"></i>
            Editar
          </button>
        </div>
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="text-left">Inicio</th>
              <th class="text-left">Fin</th>
              <th class="text-left">Módulo</th>
              <th class="text-left">Diplomado</th>
              <th class="text-left">Profesor</th>
              <th class="text-left">Visible</th>
              <th class="text-left">Opciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr v-for="course in group.courses" :key="'indc'+course.id">
              <td class="py-1">{{ dateFormat(course.start_date) }}</td>
              <td class="py-1">{{ dateFormat(course.end_date) }}</td>
              <td class="py-1">{{ course.module.number }}</td>
              <td class="py-1">{{ truncate(course.module.name) }}</td>
              <td class="py-1">
                {{ 
                  course.professor ? 
                  course.professor.name+"  "+course.professor.last_name : 
                  "Sin asignación" 
                }}  
              </td>
              <td class="py-1">
                <span 
                  v-if="course.review && course.review.visible === 1"
                  class="text-lime-600 font-semibold"
                >
                  Si
                </span>
                <span 
                  v-else
                  class="text-red-500 font-semibold"
                >
                  No
                </span>
              </td>
              <td class="py-1">
                <button 
                  :class="['bo-mini mb-1', pageThemeStore.bgColor]">
                  <i class="fa-solid fa-pen mr-0.5"></i>
                  Editar
                </button>
                <button 
                  v-if = "course.review"
                  :class="['bo-mini', pageThemeStore.bgColor]">
                  <i class="fa-solid fa-clipboard-check mr-0.5"></i>
                  Revisar
                </button>
                <button 
                  v-else
                  :class="['bo-mini', pageThemeStore.bgColor]">
                  <i class="fa-solid fa-calendar-plus mr-0.5"></i>
                  Cargar Revisión
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
    <EditGroup v-model="modalEditGroup"/>
    <EditCourse v-model="modalEditCourse"/>
    <ReviewCourse v-model="modalReviewCourse"/>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import { truncate } from '@/utils/strTruncate';
  import { dateFormat } from '@/utils/dateFormat';
  import EditGroup from '@/components/modals/certificate/EditGroup.vue';
  import EditCourse from '@/components/modals/certificate/EditCourse.vue';
  import ReviewCourse from '@/components/modals/certificate/ReviewCourse.vue';

  const pageThemeStore = usePageThemeStore();

  const props = defineProps({
    groups: {
      type: Array,
      default: () => []
    }
  });

  const modalEditGroup = ref(false);
  const modalEditCourse = ref(false);
  const modalReviewCourse = ref(false);

  const openModal = (option) => {
    switch (option) {
      case 'editGroup':
        modalEditGroup.value = true;
        break;
      case 'editCourse':
        modalEditCourse.value = true;
        break;
      case 'reviewCourse':
        modalReviewCourse.value = true;
        break;
    }
  }
</script>