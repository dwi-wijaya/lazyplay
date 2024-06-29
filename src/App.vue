<template>
  <div>
    <Sidebar />
    <main class="group/main lg:ml-64  ml-0 min-h-[100vh]">
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
