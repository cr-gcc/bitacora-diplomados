<template>
  <div class="bg-cover bg-no-repeat bg-center" :style="`background-image: url('${principalImage}');`">
    <div class="flex justify-center h-screen">
      <div class="hidden lg:block lg:w-2/3 h-full">
      </div>
      <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6 bg-black opacity-80">
        <div class="flex-1">
          <div class="text-center">
            <div class="flex justify-center mx-auto">
              <img class="w-auto h-7 sm:h-22" :src="logo" alt="">
            </div>
          </div>
          <div class="mt-8">
            <form>
              <div class="mb-4">
                <label for="user" class="block text-md text-yellow-600 mb-2">Usuario</label>
                <input v-model="user" type="text" name="user" id="user" class="block w-full px-4 py-2 text-gray-900 border rounded-lg bg-gray-200 border-yellow-400  focus:border-yellow-600 focus:ring-yellow-600 focus:outline-none focus:ring focus:ring-opacity-40" />
              </div>
              <div class="mb-6">
                <label for="password" class="block text-md text-yellow-600 mb-2">Contraseña</label>
                <input v-model="password" type="password" name="password" id="password" class="block w-full px-4 py-2 text-gray-900 border rounded-lg bg-gray-200 border-yellow-400  focus:border-yellow-600 focus:ring-yellow-600 focus:outline-none focus:ring focus:ring-opacity-40"/>
              </div>
              <div>
                <button @click="login()" class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-900 rounded-lg hover:bg-green-700 focus:outline-none focus:bg-green-600 focus:ring focus:ring-green-300 focus:ring-opacity-50">
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const principalImage = 'https://srisriuniversity.edu.in/wp-content/uploads/2022/08/Faculty-of-Management-Studies-scaled-e1661238593149-1536x864.jpg';
  const logo = 'https://thor.fca.unam.mx/cedigec/cedigec/assets/img/logos/cedigec_s_trans.png';

  const router = useRouter();
  const user = ref('');
  const password = ref('');

  const login = () => {
    // Aquí iría la validación real
    if (user.value && password.value) {
      router.push('/');
    } 
    else {
      alert('Completa los campos.');
    }
  };
</script>
