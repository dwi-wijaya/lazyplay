<template>
  <div>
    <Sidebar />
    <main class="group/main lg:ml-64 p-6 pt-20 ml-0 min-h-[100vh]">
      <Overlay />
      <router-view />
    </main>
  </div>
</template>

<script>
import Overlay from './components/layout/Overlay.vue';
import Sidebar from './components/layout/Sidebar.vue';

export default {
  components: {
    Sidebar,
    Overlay
  },

};
</script>
<style>
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
</style>