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
      <button class="bcb-certificate border-sky-900 bg-sky-900">
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
                <i class="fa-solid fa-pen mr-1"></i>
                Editar
              </button>
            </td>
          </tr> 
        </tbody> 
      </table>
    </div>
  </div>
  <SplashScreen :isLoadingSS="loading" />
</template>
<script setup>
  import { ref } from 'vue'; 
  import { useTitleStore } from '@/stores/useTitleStore';
  import axios from 'axios';

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpoint = import.meta.env.VITE_PROFESSORS;
  const url = `${apiBaseUrl}${endpoint}`;
  const titleStore = useTitleStore();
  const loading = ref(false);
  const error = ref(null);
  const professors = ref([]);
  const professor = ref(null);
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
    let selectedProfessor = professors.value.find(p => p.id === id);
    if (selectedProfessor) {
      professor.value = selectedProfessor; // Lo asignas directamente
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


</script>