<template>
  {{ professor }}
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
    <div>
      <input
        type="number"
        id="grupo"
        placeholder="Buscar"
        class="w-full rounded px-2 py-1 border border-sky-900"
      />
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900">
        Inactivos
      </button>
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900">
        Activos
      </button>
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900" @click="getAllProfessors()">
        Todos
      </button>
    </div>
    <div>
      <button class="bcb-certificate border-sky-900 bg-sky-900" @click="addProfessor()">
        Agregar
      </button>
    </div>
  </div>
  <div v-if="professors.length>0" class="bg-gray-300 px-4 py-2 text-sm">
    <div class="overflow-x-auto">
      <table class="table-auto w-full min-w-max">
        <thead class="text-center">
          <tr>
            <th class="px-1 font-bold">#</th>
            <th class="px-1">Nombre</th>
            <th class="px-1">Apellidos</th>
            <th class="px-1">Email</th>
            <th class="px-1">RFC</th>
            <th class="px-1">Estatus</th>
            <th class="px-1">Usuario</th>
            <th class="px-1">Contraseña</th>
            <th class="px-1">Opciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300 text-center">
          <tr v-for="(prof, ind) in professors" :key="'prof'+ind">
            <td class="font-bold">{{ ind+1 }}</td>
            <td class="px-1">{{ prof.name }}</td>
            <td class="px-1">{{ prof.last_name }}</td>
            <td class="px-1">{{ prof.email }}</td>
            <td class="px-1">{{ prof.rfc }}</td>
            <td class="px-1">
              <i class="fa-solid fa-circle" :class="prof.active ? 'text-lime-600' : 'text-red-700'"></i>
            </td>
            <td class="px-1">{{ prof.user }}</td>
            <td class="px-1">{{ prof.password }}</td>
            <td class="px-1">
              <button class="bcb-auto bg-sky-900" @click="getProfessorInArray(prof.id)">
                <i class="fa-solid fa-address-card mr-1"></i>
                Ver registro
              </button>
            </td>
          </tr> 
        </tbody> 
      </table>
    </div>
  </div>
  <SplashScreen :isLoadingSS="loading" />
  <ModalOptions v-model="isModalOpen" title="Profesor">

    <div v-if="professorFlag==1" class="grid-max-3 gap-4">
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
    <div v-else class="grid-max-3 gap-4">
      <div>
        <span class="whitespace-nowrap">Nombre</span>
        <input v-model="form.name" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Apellidos</span>
        <input v-model="form.last_name" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Email</span>
        <input v-model="form.email" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">RFC</span>
        <input v-model="form.rfc" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Usuario</span>
        <input v-model="form.user" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Contraseña</span>
        <input v-model="form.password" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Estatus</span>
        <select
          v-model="form.active"
          name="status"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un estatus</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-1">
      <button 
        @click="confirmarAccion" 
        class="bcb-modal bg-sky-800">
        {{ professorFlag==0 ? 'Guardar' : 'Editar' }}
      </button>
      <button 
        @click="isModalOpen = false" 
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </div>
    <div v-if="progressBar" class="mt-2">
      <ProgressBar/>
    </div>
  </ModalOptions>
</template>
<script setup>
  import { ref } from 'vue'; 
  import { useTitleStore } from '@/stores/useTitleStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import ProgressBar from '@/components/ProgressBar.vue';
  import axios from 'axios';

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpoint = import.meta.env.VITE_PROFESSORS;
  const url = `${apiBaseUrl}${endpoint}`;
  const titleStore = useTitleStore();
  const loading = ref(false);
  const isModalOpen = ref(false);
  const progressBar = ref(false);
  const error = ref(null);
  const professorFlag = ref(0);
  const professors = ref([]);
  const professor = ref();
  const form = ref({
    'name':'',
    'last_name':'',
    'email':'',
    'rfc':'',
    'user':'',
    'password':'',
    'active':'',
  });

  titleStore.setColorTitle('Profesores', 'sky-900');

  const getAllProfessors = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      professors.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los certificados';
    } finally {
      loading.value = false;
    }
  };

  const getProfessorInArray = async (id) => {
    professor.value = null;
    professorFlag.value = 1;
    let selectedProfessor = professors.value.find(p => p.id === id);
    if (selectedProfessor) {
      professor.value = selectedProfessor;
      isModalOpen.value = true;
    } 
    else {
      getProfessor(id);
    }

  };

  const getProfessor = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      professor.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los certificados';
    } finally {
      loading.value = false;
    }
  };

  const addProfessor = () => {
    professorFlag.value = 0;
    isModalOpen.value = true;
  }
  /*
  const sendProfessor = async () = {

  }
  */
</script>