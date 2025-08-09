<template>
  <div v-if="certificate">
    {{ form }}
    <h3 class="text-3xl mb-2" :class="'text-'+certificate.color">Grupos</h3>
    <div class="grid-max-5 gap-4 mb-4">
      <div>
        <input
          type="text"
          placeholder="Buscar"
          class="w-full rounded px-2 py-1 text-md border"
          :class="'border-'+certificate.color"
          v-model="info"
          @keyup.enter="searchCourse()"
        />
      </div>
      <div>
        <button 
          @click="getCoursesByStatus(0)"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Finalizados
        </button>
      </div>
      <div>
        <button 
          @click="getCoursesByStatus(1)"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Activos
        </button>
      </div>
      <div>
        <button 
          @click="getAllCourses()"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Todos
        </button>
      </div>
      <div>
        <button 
          @click="addCourse()"
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
  <SplashScreen :isLoadingSS="loading" />
  <ModalOptions v-model="isModalOpen" title="Cursos">
    <div v-if="courseFlag==1" class="grid-max-3 gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Nombre</span>
        <input v-model="professor.name" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Apellidos</span>
        <input v-model="professor.last_name" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Email</span>
        <input v-model="professor.email" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">RFC</span>
        <input v-model="professor.rfc" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Usuario</span>
        <input v-model="professor.user" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Contraseña</span>
        <input v-model="professor.password" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Estatus</span>
        <select
          v-model="professor.active"
          name="status"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un estatus</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
    </div>
    <div v-else class="grid-max-3 gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Profesor</span>
        <select
          v-model="form.professor_id"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un profesor</option>
          <option v-for="professor in professors" :value="professor.id" :key="'ind_'+professor.id">
            {{ professor.name }} {{ professor.last_name }}
          </option>
        </select>
      </div>
      <div>
        <span class="whitespace-nowrap">Módulo</span>
        <select
          v-model="form.module_id"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un módulo</option>
        </select>
      </div>
      <div>
        <span class="whitespace-nowrap">Grupo</span>
        <input v-model="form.group" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Fecha de Inicio</span>
        <input v-model="form.start_date" type="date" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Fecha de Termino</span>
        <input v-model="form.end_date" type="date" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Estatus</span>
        <select
          v-model="form.status"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un estatus</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
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
        @click="sendProfessor()" 
        class="bcb-modal bg-sky-800">
        {{ professorFlag==0 ? 'Guardar' : 'Editar' }}
      </button>
      <button 
        @click="closeProfessor()"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
    <div v-if="progressBar" class="mt-2">
      <ProgressBar/>
    </div>
  </ModalOptions>
</template>

<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useTitleStore } from '@/stores/useTitleStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import ProgressBar from '@/components/ProgressBar.vue';
  import axios from 'axios';

  const route = useRoute();
  const slug = route.params.slug;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpointc = import.meta.env.VITE_CERTIFICATE;
  const endpointp = import.meta.env.VITE_PROFESSORS;
  const endpointm = import.meta.env.VITE_MODULES;
  const url = `${apiBaseUrl}${endpointc}/${slug}`;
  const urlp = `${apiBaseUrl}${endpointp}`;
  const urlm = `${apiBaseUrl}${endpointm}`;
  const titleStore = useTitleStore();
  const loading = ref(false);
  const isModalOpen = ref(false);
  const progressBar = ref(false);
  const certificate = ref(null);
  const success = ref(null);
  const error = ref(null);
  const professors = ref([]);
  const modules = ref([]);
  const courseFlag = ref(0);
  const records = ref([]);
  const info = ref("");
  const form = ref({
    'certificate_id':'',
    'professor_id':'',
    'module_id':'',
    'group':'',
    'start_date':'',
    'end_date':'',
    'status':'',
  });

  watch(() => certificate.value, (newVal) => {
    if (newVal.name && newVal.color) {
      titleStore.setColorTitle(newVal.name, newVal.color);
    }
  });

  const searchCourse = async () => {
    alert(info.value);
  };

  const getCoursesByStatus = async () => {};

  const getAllCourses = async () => {
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

  const addCourse = async () => {
    courseFlag.value = 0;
    isModalOpen.value = true;
  };

  const closeProfessor = () => {
    isModalOpen.value = false;
    error.value = null;
    success.value = null;
  }

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

  const getActiveProfessors = async () => {
    try {
      const response = await axios.get(`${urlp}/by-status/1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      professors.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error consultar el profesor';
    }
  }

  const getModules = async () => {

  }

  onMounted(() => {
    getCertificate();
    getActiveProfessors();
  });
</script>
