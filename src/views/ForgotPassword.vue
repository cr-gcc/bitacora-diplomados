<template>
  <div class="bg-cover bg-no-repeat bg-center" :style="`background-image: url('${principalImage}');`">
    <div class="flex justify-end min-h-screen">
      <div class="hidden lg:block lg:w-2/3 h-full"></div>
      <div class="flex items-center w-full max-w-md px-6 lg:w-2/6 lg:ml-auto bg-black/80">
        <div class="flex-1">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="flex justify-center mx-auto">
              <img class="w-auto h-7 sm:h-22" :src="logo" alt="Logo" />
            </div>
            <!--
            <h2 class="text-yellow-500 text-lg font-semibold mt-4">
              Recuperar contraseña
            </h2>
            -->
          </div>

          <!-- Formulario -->
          <form @submit.prevent="requestPasswordReset">
            <div class="mb-4">
              <label for="email" class="block text-md text-yellow-600 mb-2">Correo electrónico</label>
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                required
                class="block w-full px-4 py-2 text-gray-900 border rounded-lg bg-gray-200 border-yellow-400 focus:border-yellow-600 focus:ring-yellow-600 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-900 rounded-lg hover:bg-green-700 focus:outline-none focus:bg-green-600 focus:ring focus:ring-green-300 focus:ring-opacity-50"
            >
              {{ pb ? 'Enviando...' : 'Enviar enlace de recuperación' }}
            </button>
          </form>
          <!-- Volver al login -->
          <div class="mt-2 text-center">
            <RouterLink
              to="/login"
              class="text-yellow-600 hover:font-semibold text-sm"
            >
              Volver al inicio de sesión
            </RouterLink>
          </div>
          <!-- Mensajes -->
          <div v-if="pb" class="mt-2">
            <PB/>  
          </div>
          <p v-if="success" class="text-green-500 mt-4 text-sm text-center">
            {{ success }}
          </p>
          <p v-if="error" class="text-red-500 mt-4 text-sm text-center">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import PB from '@/components/ui/ProgressBar.vue';
  import api from '@/plugins/axios';

  const endpoint = import.meta.env.VITE_FORGOT_PASSWORD;
  const principalImage = '/assets/images/wallpapers/fondo.jpg';
  const logo = 'https://thor.fca.unam.mx/cedigec/cedigec/assets/img/logos/cedigec_s_trans.png';
  const pb = ref(false);
  const email = ref("");
  const error = ref("");
  const success = ref("");

  const requestPasswordReset = async () => {
    pb.value = true;
    error.value = "";
    success.value = "";
    const body = {
      email: email.value,
    }

    try {
      const { data } = await api.post(endpoint, body);
      success.value = data.message || "Se ha enviado un correo con las instrucciones.";
    } catch (err) {
      error.value =  err.response?.data?.message ||
        "No pudimos procesar tu solicitud. Intenta más tarde.";
    } finally {
      pb.value = false;
    }
  };
</script>
