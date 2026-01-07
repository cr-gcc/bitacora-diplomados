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
  <!--
  <ModalOptions v-model="modalEditCourse" modalWidth="max-w-xl" title="Editar Cursos">
    <div class="grid-max-2 gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Fecha de Inicio</span>
        <input v-model="course.start_date" type="date" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Fecha de Termino</span>
        <input v-model="course.end_date" type="date" class="base-input-gray"/>
      </div>
      <div class="col-span-2">
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
        Salir
      </button>
    </div>
  </ModalOptions>
  <ModalOptions v-model="modalReview" modalWidth="max-w-3xl" title="Revisión Curso">
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
        <span class="whitespace-nowrap">Grupo con Usuarios</span>
        <label
          for="users_in_group"
          class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
        >
          <input v-model="review.users_in_group" type="checkbox" id="users_in_group" class="peer sr-only" />
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

      <div class="flex items-center gap-3">
        <span class="whitespace-nowrap">Grupo Visible</span>
        <label
          for="visible"
          class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
        >
          <input v-model="review.visible" type="checkbox" id="visible" class="peer sr-only" />
          <span
            class="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4 dark:bg-gray-300"
          ></span>
        </label>
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
        Salir
      </button>
    </div>
  </ModalOptions>
  -->
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
  
  const endpointCertificate = import.meta.env.VITE_CERTIFICATE;
  const endpointProfessors = import.meta.env.VITE_PROFESSORS;
  const endpointModules = import.meta.env.VITE_MODULES;
  const endpointCourses= import.meta.env.VITE_COURSES;
  const endpointGroups = import.meta.env.VITE_GROUPS;
  const endpointReviews = import.meta.env.VITE_REVIEWS;
  const app = useAppStore(); 
  const pageThemeStore = usePageThemeStore();

  const modalAddGroup = ref(false);
  const modalEditGroup = ref(false);
  const modalEditCourse = ref(false);
  const modalFinishGroup = ref(false);
  const modalReview = ref(false);
  const certificate = ref(null);
  const course = ref(null);
  const courseId = ref(null);
  const reviewId = ref(null);
  const groupId = ref(null);
  const success = ref(null);
  const error = ref(null);
  const modules = ref([]);
  const groups = ref([]);
  const courseFlag = ref(0);
  const status = ref("");
  const code = ref("");
  const formEdit = ref({
    'certificate_id':'',
    'code':'',
    'status':''
  })
  const review = ref({
    'course_id':'',
    'study_plan':'',
    'dates':'',
    'users_in_group':'',
    'exam':'',
    'students':'',
    'repeaters':'',
    'visible':'',
    'comments':'',
  });
  /*
  //  Observers
  const totalStudentsRepeaters = computed(
    () => review.value.students + review.value.repeaters
  );
  */
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

  
  const openModalCourseEdit = async (id) => {
    courseId.value = id;
    courseFlag.value = 1;
    await getCourse();
    modalEditCourse.value = true;
  };
  const openModalEdit = (id, certificate_id, code) => {
    groupId.value = id;
    formEdit.value.certificate_id = certificate_id;
    formEdit.value.code = code;
    modalEditGroup.value = true;
  }
  const openModalReview = async (id) => {
    setInitValues(1);
    const url= `${endpointReviews}/${id}`;
    reviewId.value = id;
    try {
      const response = await api.get(url);
      app.loadingApp = false;
      if (response.status == 200) {
        review.value.course_id = response.data.course_id;
        review.value.study_plan = Boolean(response.data.study_plan);
        review.value.dates = Boolean(response.data.dates);
        review.value.users_in_group = Boolean(response.data.users_in_group);
        review.value.exam = response.data.exam;
        review.value.students = response.data.students;
        review.value.repeaters = response.data.repeaters;
        review.value.visible = Boolean(response.data.visible);
        review.value.comments = response.data.comments;
        modalReview.value = true;
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      app.loadingApp = false;
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
      modalEditGroup.value = false;
    }
    else if (option==3) {
      modalReview.value = false;
      review.value.course_id = "";
      review.value.study_plan = "";
      review.value.dates = "";
      review.value.users_in_group = "";
      review.value.exam = "";
      review.value.students = "";
      review.value.repeaters = "";
      review.value.visible = "";
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
    const url = `${endpointGroups}/${certificate.value.id}/search`;
    try {
      const response = await api.post(url, form.value);
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
  
  const getCourse = async () => {
    setInitValues(1);
    const url = `${endpointCourses}/${courseId.value}`;
    try {
      const response = await api.get(url);
      course.value = response.data;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      app.loadingApp = false;
    }
  };

  const editReview = async () => {
    setInitValues(1);
    const url = `${endpointReviews}/${reviewId.value}`;
    try {
      const response = await api.put(url, review.value);
      if (response.status == 200) {
        success.value = response.data.message;
      }
    }
    catch (e) {
      error.value = e.response?.data?.message || 'Error al editar la revisión';
    }
    finally {
      app.loadingApp = false;
    }
  }
  const setInitValues = (option) => {    
    app.loadingApp = option==1 ? true : false;
    error.value = null;
    success.value = null;
  }
  //  Init functions
  const getCertificate = async () => {
    setInitValues(1);
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
