<template>
  <div v-if="certificate">
    <h3 class="text-3xl mb-2" :class="'text-'+certificate.color">Grupos</h3>
    <div class="grid-max-4 gap-4 mb-4">
      <div>
        <input
          v-model="info"
          type="number"
          placeholder="Buscar"
          class="w-full rounded px-2 py-1 text-md border"
          :class="'border-'+certificate.color"
          @keyup.enter="searchGroup()"
        ></input>
      </div>
      <select
        v-model="status"
        placeholder="Estatus"
        class="w-full rounded px-2 py-1 text-md border"
        :class="'border-'+certificate.color"
      >
        <option value="" disabled>Seleccione un estatus</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
        <option value="finished">Finalizado</option>
      </select>
      <div>
        <button 
          @click="getGroupCourses()"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Todos
        </button>
      </div>
      <div>
        <button 
          @click="openModalCourseAdd()"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Agregar
        </button>
      </div>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="errorSearch">
      <p class="text-red-700">{{ errorSearch }}</p>
    </div>
    <div v-if="groups.length>0" class="space-y-4">
      <details v-for="group in groups" :key="'indg'+group.id" class="group [&_summary::-webkit-details-marker]:hidden">
        <summary
          class="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 px-2 py-1 text-white"
          :class="['border-'+certificate.color, 'bg-'+certificate.color]"
        >
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
              @click="openModalDelete(group.id)"
              class="bo-mini"
              :class="['bg-'+certificate.color]">
              <i class="fa-solid fa-pen mr-0.5"></i>
              Editar
            </button>
            <!--
            <button 
              @click="openModalDelete(group.id)"
              class="bo-mini"
              :class="['bg-'+certificate.color]">
              <i class="fa-solid fa-trash"></i>
              Eliminar
            </button>
            <button 
              @click="openModalFinish(group.id)"
              class="bo-mini"
              :class="['bg-'+certificate.color]">
              <i class="fa-solid fa-clipboard-check"></i>
              Finalizar
            </button>
            -->
          </div>
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
              <tr v-for="course in group.courses" :key="'indc'+course.id">
                <td class="py-1">{{ course.start_date }}</td>
                <td class="py-1">{{ course.end_date }}</td>
                <td class="py-1">{{ course.module.number }}</td>
                <td class="py-1">{{ course.module.name }}</td>
                <td class="py-1">
                  {{ 
                    course.professor ? 
                    course.professor.name+"  "+course.professor.last_name : 
                    "Sin asignación" 
                  }}  
                </td>
                <td class="py-1">
                  <button 
                    @click="openModalCourseEdit(course.id)"
                    class="bo-mini mb-1"
                    :class="['bg-'+certificate.color]">
                    <i class="fa-solid fa-pen mr-0.5"></i>
                    Editar
                  </button>
                  <button 
                    v-if = "course.review"
                    @click="openModalReview(course.review.id)"
                    class="bo-mini"
                    :class="['bg-'+certificate.color]">
                    <i class="fa-solid fa-clipboard-check mr-0.5"></i>
                    Revisar
                  </button>
                  <button 
                    v-else
                    @click="createReview(course.id)"
                    class="bo-mini mb-1"
                    :class="['bg-'+certificate.color]">
                    <i class="fa-solid fa-calendar-plus mr-0.5"></i>
                    Cargar Revisión
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  </div>
  <div v-else>
    <p>{{ error }}</p>
  </div>  
  <SplashScreen :isLoadingSS="loading" />
  <ModalOptions v-model="modalAddGroup" title="Agregar Grupo">
    <div class="gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Grupo</span>
        <input v-model="form.code" type="text" class="base-input-gray" placeholder="Ejemplo: 9041"/>
      </div>  
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="addEditGroupCourse()" 
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="success ? closeAndGetGroups(0) : closeModal(0)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
  </ModalOptions>
  <ModalOptions v-model="modalEditCourse" title="Editar Cursos">
    <div class="grid-max-2 gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Fecha de Inicio</span>
        <input v-model="course.start_date" type="date" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Fecha de Termino</span>
        <input v-model="course.end_date" type="date" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Profesor</span>
        <select
          v-model="course.professor_id"
          class="base-input-gray"
        >
          <option value="null" disabled>Seleccione un profesor</option>
          <option v-for="professor in professors" :value="professor.id" :key="'ind_'+professor.id">
            {{ professor.name }} {{ professor.last_name }}
          </option>
        </select>
      </div>
      <div>
        <span class="whitespace-nowrap">Estatus</span>
        <select
          v-model="course.status"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un estatus</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="addEditGroupCourse()"
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="success ? closeAndGetGroups(1) : closeModal(1)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
  </ModalOptions>
  <ModalOptions v-model="modalDeleteGroup" title="Eliminar Grupo">
    <div class="gap-4 mb-2">
      <p>Si elimina el grupo, todos los cursos se eliminarán tambien. ¿Desea Eliminar el grupo?</p>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="deleteGroup()" 
        class="bcb-modal bg-sky-800">
        Eliminar
      </button>
      <button 
        @click="success ? closeAndGetGroups(2) : closeModal(2)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
  </ModalOptions>
  <ModalOptions v-model="modalFinishGroup" title="Terminar Grupo">
    <div class="gap-4 mb-2">
      <p>Al finalizar el grupo, este no se borrará, simplemente se cambiara su estatus a finalizado. ¿Desea finalizar el grupo?</p>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="finishGroup()" 
        class="bcb-modal bg-sky-800">
        Eliminar
      </button>
      <button 
        @click="success ? closeAndGetGroups(4) : closeModal(4)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>

  </ModalOptions>
  <ModalOptions v-model="modalReview" title="Revisión Curso">
    <div class="grid-max-3 gap-4 mb-2">
      <div class="flex items-center gap-3">
        <span class="whitespace-nowrap">Plan de Trabajo</span>
        <label
          for="plan"
          class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
        >
          <input v-model="review.study_plan" type="checkbox" id="plan" class="peer sr-only" />
          <span
            class="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4 dark:bg-gray-300"
          ></span>
        </label>
      </div>
      <div class="flex items-center gap-3">
        <span class="whitespace-nowrap">Fechas</span>
        <label
          for="dates"
          class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
        >
          <input v-model="review.dates" type="checkbox" id="dates" class="peer sr-only" />
          <span
            class="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4 dark:bg-gray-300"
          ></span>
        </label>
      </div>
      <div class="flex items-center gap-3">
        <span class="whitespace-nowrap">Examen</span>
        <select
          v-model="review.exam"
          class="base-input-gray"
        >
          <option value="pendant">Pendiente</option>
          <option value="tested">Realizado</option>
        </select>
      </div>
      <div class="flex items-center gap-3">
        <span class="whitespace-nowrap">Estudiantes</span>
        <input v-model="review.students" type="number" class="base-input-gray"/>
      </div>
      <div class="flex items-center gap-3">
        <span class="whitespace-nowrap">Recursadores</span>
        <input v-model="review.repeaters" type="number" class="base-input-gray"/>
      </div>
      <div class="flex items-center gap-3">
        <span class="whitespace-nowrap">Total</span>
        <input v-model="totalStudentsRepeaters" type="number" class="base-input-gray" disabled/>
      </div>
      <div class="md:col-span-3">
        <label for="comentario">Comentario</label>
        <textarea v-model="review.comments" id="comentario"
          class="base-input-gray mt-0.5 w-full h-24 resize-none rounded border-gray-300 shadow-sm sm:text-sm"
          placeholder="Escribe tu comentario aquí..."
        ></textarea>
      </div>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="editReview()"
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="success ? closeAndGetGroups(3) : closeModal(3)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
  </ModalOptions>
</template>

<script setup>
  import { onMounted, computed, watch, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useTitleStore } from '@/stores/useTitleStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import axios from 'axios';
  // Data
  const route = useRoute();
  const slug = route.params.slug;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpointCertificate = import.meta.env.VITE_CERTIFICATE;
  const endpointProfessors = import.meta.env.VITE_PROFESSORS;
  const endpointModules = import.meta.env.VITE_MODULES;
  const endpointCourses= import.meta.env.VITE_COURSES;
  const endpointGroups = import.meta.env.VITE_GROUPS;
  const endpointReviews = import.meta.env.VITE_REVIEWS;
  const titleStore = useTitleStore();
  const loading = ref(false);
  const modalDeleteGroup = ref(false);
  const modalAddGroup = ref(false);
  const modalEditCourse = ref(false);
  const modalFinishGroup = ref(false);
  const modalReview = ref(false);
  const certificate = ref(null);
  const course = ref(null);
  const courseId = ref(null);
  const groupId = ref(null);
  const reviewId = ref(null);
  const success = ref(null);
  const error = ref(null);
  const errorSearch = ref(null);
  const professors = ref([]);
  const modules = ref([]);
  const groups = ref([]);
  const courseFlag = ref(0);
  const info = ref("");
  const status = ref("");
  const form = ref({
    'certificate_id':'',
    'code':'',
  });
  const review = ref({
    'course_id':'',
    'study_plan':'',
    'dates':'',
    'exam':'',
    'students':'',
    'repeaters':'',
    'comments':'',
  });

  //  Observers
  const totalStudentsRepeaters = computed(() => review.value.students + review.value.repeaters);
  watch(() => certificate.value, (newVal) => {
    if (newVal.name && newVal.color) {
      titleStore.setColorTitle(newVal.name, newVal.color);
    }
  });

  //  Open modals
  const openModalCourseAdd = () => {
    setInitValues(0)
    courseFlag.value = 0;
    form.value.certificate_id = certificate.value.id;
    modalAddGroup.value = true;
  }
  const openModalCourseEdit = async (id) => {
    courseId.value = id;
    courseFlag.value = 1;
    await getCourse();
    modalEditCourse.value = true;
  };
  const openModalDelete = (id) => {
    groupId.value = id;
    modalDeleteGroup.value = true;
  }
  const openModalFinish = (id) => {
    groupId.value = id;
    modalFinishGroup.value = true;
  }
  const openModalReview = async (id) => {
    setInitValues(1);
    const urlReview = `${apiBaseUrl}${endpointReviews}/${id}`;
    reviewId.value = id;
    try {
      const response = await axios.get(urlReview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      loading.value = false;
      if (response.status == 200) {
        review.value.course_id = response.data.course_id;
        review.value.study_plan = Boolean(response.data.study_plan);
        review.value.dates = Boolean(response.data.dates);
        review.value.exam = response.data.exam;
        review.value.students = response.data.students;
        review.value.repeaters = response.data.repeaters;
        review.value.comments = response.data.comments;
        modalReview.value = true;
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      loading.value = false;
    }
  }

  //  Close modals
  const closeModal = (option) => {
    setInitValues(0);
    if (option==1) {
      modalEditCourse.value = false;
      course.value = null;
    }
    else if (option==2) {
      modalDeleteGroup.value = false;
    }
    else if (option==3) {
      modalReview.value = false;
      review.value.course_id = "";
      review.value.study_plan = "";
      review.value.dates = "";
      review.value.exam = "";
      review.value.students = "";
      review.value.repeaters = "";
      review.value.comments = "";
    }
    else if (option==4){
      modalFinishGroup.value = false;
    }
    else {
      modalAddGroup.value = false;
      form.value.code = "";  
    }
  }
  const closeAndGetGroups = (option) => {
    closeModal(option);
    getGroupCourses();
  }

  //  Funtions
  const searchGroup = async () => {
    errorSearch.value = null;
    groups.value = [];
    const code = info.value;
    if (!code || isNaN(code)) {
      errorSearch.value = "El código debe ser un número válido.";
    }
    else {
      loading.value = true;
      const urlGroup = `${apiBaseUrl}${endpointGroups}/${certificate.value.id}/by-code/${code}`;
      try {
        const response = await axios.get(urlGroup, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        groups.value = response.data;
        errorSearch.value = groups.value.length > 0 
          ? null 
          : 'No se encontraron grupos con este código';
      } catch (e) {
        errorSearch.value = e.response?.data?.message || 'Error al cargar el grupo.';
      } finally {
        loading.value = false;
        info.value = null;
      }  
    }
  };
  const addEditGroupCourse = async () => {
    setInitValues(1);
    const urlGroups = `${apiBaseUrl}${endpointGroups}`;
    const urlCourses = course.value ? `${apiBaseUrl}${endpointCourses}/${course.value.id}` : null;
    const method = courseFlag.value === 0 ? 'post' : 'put';
    const body = courseFlag.value === 0 ? form.value : course.value;
    const finalUrl = courseFlag.value === 0 ? urlGroups : urlCourses;

    try {
      const response = await axios[method](finalUrl, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status == 200) {
        success.value = response.data.message;
      }
    }
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los grupos';
    } 
    finally {
      loading.value = false;    
    }
  }
  const getCourse = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpointCourses}/${courseId.value}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      course.value = response.data;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      loading.value = false;
    }
  };
  const getCoursesByStatus = (opt) => {
    alert(opt);
  };
  const getGroupCourses = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpointGroups}-courses/${certificate.value.id}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.length) {
        groups.value = response.data;
      }
      else  {
        error.value = "No se encontraron grupos de este diplomado."
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los grupos';
    } 
    finally {
      loading.value = false;
    }
  };
  const deleteGroup = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpointGroups}/${groupId.value}`;
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status == 200) {
        success.value = response.data.message;
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      loading.value = false;
    }
  };
  const finishGroup = async () => {
    setInitValues(1);
  }
  const createReview = async (id) => {
    setInitValues(1);
    const urlReview = `${apiBaseUrl}${endpointReviews}`;
    const body = ref({
      'course_id':id
    });

    try {
      const response = await axios.post(urlReview, body.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status == 200) {
        success.value = response.data.message;
        alert(success.value);
        getGroupCourses();
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar la revisión';
      alert(error.value);
    }
    finally {
      loading.value = false;    
    }
  }
  const editReview = async () => {
    setInitValues(1);
    const urlReview = `${apiBaseUrl}${endpointReviews}/${reviewId.value}`;
    try {
      const response = await axios.put(urlReview, review.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status == 200) {
        success.value = response.data.message;
      }
    }
    catch (e) {
      error.value = e.response?.data?.message || 'Error al editar la revisión';
    }
    finally {
      loading.value = false;
    }
  }
  const setInitValues = (option) => {    
    loading.value = option==1 ? true : false;
    error.value = null;
    success.value = null;
  }
  //  Init functions
  const getCertificate = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpointCertificate}/${slug}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      certificate.value = response.data;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      loading.value = false;
    }
  };
  const getActiveProfessors = async () => {
    const url = `${apiBaseUrl}${endpointProfessors}`;
    try {
      const response = await axios.get(`${url}/by-status/1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      professors.value = response.data; 
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error consultar el profesor';
    }
  }
  const getModules = async () => {
    const url = `${apiBaseUrl}${endpointModules}`;
    try {
      const response = await axios.get(`${url}/by-certificate/${certificate.value.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      modules.value = response.data; 
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error consultar los módulos';
    }
  }

  //  Hooks
  onMounted(async () => {
    await getCertificate();
    getActiveProfessors();
    getModules();
  });
</script>
