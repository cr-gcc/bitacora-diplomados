<template>
  <div v-if="certificate">
    <h3 class="text-3xl mb-2" :class="pageThemeStore.textColor">Grupos</h3>
    <div class="grid-max-4 gap-4 mb-4">
      <div>
        <input
          v-model="code"
          type="number"
          placeholder="Buscar"
          class="w-full rounded px-2 py-1 text-md border"
          :class="pageThemeStore.borderColor"
          @keyup.enter="searchGroupsCourses(1)"
        ></input>
      </div>
      <select
        v-model="status"
        id="status"
        placeholder="Estatus"
        class="w-full rounded px-2 py-1 text-md border"
        :class="pageThemeStore.borderColor"
        @change="searchGroupsCourses(2)"
      >
        <option value="" disabled>Seleccione un estatus</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
        <option value="finished">Finalizado</option>
      </select>
      <div>
        <button 
          @click="searchGroupsCourses(3)"
          :class="[
            'bcb-certificate',
            pageThemeStore.borderColor,
            pageThemeStore.bgColor
          ]">
          Todos
        </button>
      </div>
      <div>
        <button 
          @click="openModalGroup('add')"
          :class="[
            'bcb-certificate',
            pageThemeStore.borderColor,
            pageThemeStore.bgColor
          ]">
          Agregar
        </button>
      </div>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <AccordionGroup :groups="groups" @refresh="searchGroupsCourses(3)"/>
    <AddGroup 
      v-model="modalAddGroup" 
      :certificate="certificate.id"
      @refresh="searchGroupsCourses(3)"
    />
  </div>
  <div v-else>
    <p>{{ error }}</p>
  </div>
</template>

<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAppStore } from '@/stores/useAppStore';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import AccordionGroup from '@/components/accordions/Group.vue';
  import AddGroup from '@/components/modals/certificate/AddGroup.vue';
  import api from '@/plugins/axios';
  //
  const route = useRoute();
  const slug = route.params.slug;
  const app = useAppStore(); 
  const pageThemeStore = usePageThemeStore();
  const modalAddGroup = ref(false);
  const modalEditGroup = ref(false);
  const certificate = ref(null);
  const success = ref(null);
  const error = ref(null);
  const modules = ref([]);
  const groups = ref([]);
  const status = ref("");
  const code = ref("");
  // Watchers
  watch(() => certificate.value, (newVal) => {
    if (newVal.name && newVal.color) {
      pageThemeStore.setPageTheme(newVal.name, newVal.color);
    }
  });
  //  Open modals methods
  const openModalGroup = (option) => {
    if (option=='add') {
      modalAddGroup.value = true;
    }
    else if (option=='edit') {
      modalEditGroup.value = true;
    }
  };
  //  Functions
  const searchGroupsCourses = async (option) => {
    setInitValues(1);
    groups.value = [];
    const form = ref(null);
    //
    if (option==1) {
      form.value = {'code':code.value}; 
    }
    else if (option==2) {
      form.value = {'status':status.value};
    }
    else {
      form.value = {'all':true};
    }
    //
    const endpointGroups = import.meta.env.VITE_GROUPS;
    const url = `${endpointGroups}/${certificate.value.id}/search`;
    const body = form.value;
    try {
      const response = await api.post(url, body);
      groups.value = response.data;
      error.value = groups.value.length > 0 
        ? null 
        : 'No se encontraron registros del grupo';
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el/los grupo.';
    } finally {
      app.loadingApp = false;
      code.value = "";
      status.value = "";
    }
  };

  const setInitValues = (option) => {    
    app.loadingApp = option==1 ? true : false;
    error.value = null;
    success.value = null;
  }
  //  Init functions
  const getCertificate = async () => {
    setInitValues(1);
    const endpointCertificate = import.meta.env.VITE_CERTIFICATE;
    const url = `${endpointCertificate}/${slug}`;
    try {
      const response = await api.get(url);
      certificate.value = response.data;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      app.loadingApp = false;
    }
  };

  const getModules = async () => {
    const endpointModules = import.meta.env.VITE_MODULES;
    const url = `${endpointModules}/by-certificate/${certificate.value.id}`;
    try {
      const response = await api.get(url);
      modules.value = response.data; 
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al consultar los módulos';
    }
  }

  //  Hooks
  onMounted(async () => {
    await getCertificate();
    getModules();

    if (route.query.code) {
      code.value = route.query.code;
      searchGroupsCourses(1);
    }
  });
</script>
