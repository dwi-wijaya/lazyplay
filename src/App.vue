<template>
  <div>
    <Sidebar v-if="user" />
    <main :class="user ? 'group/main lg:ml-64 p-6 pt-20 ml-0 min-h-[100vh]' : 'min-h-[100vh]'">
      <Overlay />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@services/supabase'; // Sesuaikan dengan struktur proyek Anda
import Overlay from './components/layout/Overlay.vue';
import Sidebar from './components/layout/Sidebar.vue';

const user = ref(null);

const router = useRouter();

onMounted(() => {
  user.value = supabase.auth.getSession();
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      user.value = session.user;
    } else {
      user.value = null;
      router.push('/signin');
    }
  });
});
</script>

<style>
@import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
</style>
