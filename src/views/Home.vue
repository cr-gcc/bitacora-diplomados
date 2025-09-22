<template>
  <div class="flex justify-end gap-4">
    <div class="flex items-center gap-1">
      <p>Fecha Actual <i class="fa-solid fa-square text-sky-900"></i></p>
    </div>
    <div class="flex items-center gap-1">
      <p>Inicio Cursos <i class="fa-solid fa-square text-gray-700"></i></p>
    </div>
  </div>
  <div v-if="error" class="mb-2">
    <p class="text-red-700">{{ error }}</p>
  </div>
  <div class="flex justify-center h-screen">
    <div class="w-full mx-auto">
      <div class="bg-white shadow-lg overflow-hidden">
        <div class="flex items-center justify-between px-6 py-3 bg-sky-900">
          <button @click="prevMonth()" class="text-white cursor-pointer">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <h2 class="text-white">{{ monthName }} {{ year }}</h2>
          <button @click="nextMonth()" class="text-white cursor-pointer">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div class="grid grid-cols-7 gap-2 p-4">
          <div class="text-center font-semibold" v-for="(day, index) in daysOfWeek" :key="'dow-' + index">
            {{ day }}
          </div>
          <div v-for="n in firstDayOfWeek" :key="'empty-' + n"></div>
          <template v-for="day in daysInMonth" :key="'day-'+day">
            <div v-if="isPromiseDate(day)" class="calendar-frame bg-gray-700 text-white cursor-pointer" @click="openModal(day)">
              {{ day }}
            </div>
            <div v-else-if="isToday(day)" class="calendar-frame bg-sky-900 text-white" >
              {{ day }}
            </div>
            <div v-else class="calendar-frame text-sky-900">
              {{ day }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <ModalOptions v-model="modalCertificates" title="Diplomados">
    <div class="max-h-[400px] overflow-auto mb-2">
      <table class="table-auto w-full min-w-max">
        <thead class="text-left">
          <tr>
            <th class="px-1 font-bold">#</th>
            <th class="px-1">Diplomado</th>
            <th class="px-1">Grupo</th>
            <th class="px-1">Módulo</th>
            <th class="px-1">Inicio</th>
            <th class="px-1">Fin</th>
            <th class="px-1">Profesor</th>
            <th class="px-1">Revisión</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          <tr v-for="(course, ind) in courses" :key="'course'+ind" :class="'text-'+course.certificate_color">
            <td class="font-bold">{{ ind+1 }}</td>
            <td class="px-1">{{ course.certificate_short_name }}</td>
            <td class="px-1">{{ course.group_code }}</td>
            <td class="px-1">{{ course.module_number }}</td>
            <td class="px-1">{{ course.start_date }}</td>
            <td class="px-1">{{ course.end_date }}</td>
            <td class="px-1">
              {{ 
                course.professor_name ? 
                course.professor_name+"  "+course.professor_last_name : 
                "Sin profesor asignado" 
              }}
            </td>
            <td class="px-1">
              {{
                course.study_plan ?
                "SI" :
                "No"
              }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-end gap-1">
      <button
        @click="closeModal()"
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </div>
  </ModalOptions>
  <SplashScreen :isLoadingSS="loading" />
</template>
<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useTitleStore } from '@/stores/useTitleStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import api from '@/plugins/axios';

  const endpointCMY = import.meta.env.VITE_CALENDAR_MY;
  const endpointCC = import.meta.env.VITE_COURSES_CALENDAR;
  const titleStore = useTitleStore();
  const currentDate = new Date();
  const year = ref(currentDate.getFullYear());
  const month = ref(currentDate.getMonth());
  const modalCertificates = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const daysOfWeek = [
    'Dom', 
    'Lun', 
    'Mar', 
    'Mie', 
    'Jue', 
    'Vie', 
    'Sab'
  ];
  const startCoursesDate = ref([]);
  const courses = ref([]);
  
  titleStore.setColorTitle('Home', 'sky-900');

  const firstDayOfWeek = computed(() => {
    return new Date(year.value, month.value, 1).getDay();
  });

  const daysInMonth = computed(() => {
    return new Date(year.value, month.value + 1, 0).getDate();
  });

  const monthName = computed(() => {
    return new Date(year.value, month.value).toLocaleString('default', { month: 'long' })
  });

  const promiseDates = computed(() => {
    if (!startCoursesDate.value) return [];
    return startCoursesDate.value.map(d => parseLocalDate(d));
  });

  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month.value === today.getMonth() &&
      year.value === today.getFullYear()
    )
  };

	const isPromiseDate = (day) => {
    return promiseDates.value.some(date =>
      day === date.getDate() &&
      month.value === date.getMonth() &&
      year.value === date.getFullYear()
    );
  };

	const openModal = async(day) => {
    loading.value = true;
    error.value = null;
    courses.value = [];
		const formattedDate = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		const url = `${endpointCC}`;
    const body = {'date':formattedDate};
    console.log("INICIO");
    try {
      const response = await api.post(url, body);
      if (response.status == 200) {
        const data = response.data.data;
        if (data.length) {
          courses.value = data;
          modalCertificates.value = true;
        }
        else {
          error.value = "No se encontraron registros."
        }
      }
      else{
        console.log("AQUI");
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los cursos.';
      console.log(error.value);
    } finally {
      loading.value = false;
    }
  };

  const closeModal = () => {
    modalCertificates.value = false;
  }

  const prevMonth = async() => {
    month.value--
    if (month.value < 0) {
      month.value = 11
      year.value--
    }
    await getCoursesDates(); 
    courses.value = [];
  }

  const nextMonth = async() => {
    month.value++
    if (month.value > 11) {
      month.value = 0
      year.value++
    }
    await getCoursesDates(); 
    courses.value = [];
	}

  const getCoursesDates = async() => {
    loading.value = true;
    error.value = null;
    const url = `${endpointCMY}`;
    const date = `${year.value}-${String(month.value + 1).padStart(2, '0')}`;
    const body = {'month_year':date};
    try {
      const response = await api.post(url, body);
      startCoursesDate.value = response.data.start_courses;
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar las fechas de inicio.';
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getCoursesDates();
  });
</script>
