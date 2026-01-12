<template>
  <div class="min-h-screen flex flex-col">
    <Header/>
    <Title/>
    <main class="flex-1 p-4 bg-gray-200">
      <div class="space-y-4 px-4 py-6">
        <slot />
      </div>
    </main>
    <Footer/>
    <ChangePassword
      v-model="showChangePassword"
      :forced="isPasswordChangeForced"
    />
  </div>
</template>
<script setup>
  import { ref, computed, watch } from 'vue';
  import { useAuthStore } from '@/stores/useAuthStore';
  import Header from '@/components/navigation/Header.vue';
  import Title from '@/components/ui/PageTitle.vue';
  import Footer from '@/components/navigation/Footer.vue';
  import ChangePassword from '@/components/modals/user/ChangePassword.vue';

  const auth = useAuthStore();
  const showChangePassword = ref(false);
  
  const isPasswordChangeForced = computed(() => {
    return auth.user?.change_password === 0;
  });
  
  watch(
    () => auth.user?.change_password,
    (value) => {
      // If user is null, hide the modal and exit
      if (!auth.user) {
        showChangePassword.value = false;
        return;
      }

      if (value === 0) {
        showChangePassword.value = true;
      }
      else {
        // Only hide if not forced or value changed
        if (!isPasswordChangeForced.value && value !== undefined) {
          showChangePassword.value = false;
        }
      }
    },
    {
      immediate: true
    }
  );
</script>