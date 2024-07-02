<template>
    <router-link to="/profile"
        class="group flex gap-3 items-center bg-background border border-stroke px-5 py-3 rounded-2xl text-base hover:text-primary base-transition">
        <i class="fad fa-user-headset group-hover:-rotate-[8deg] base-transition"></i> {{ user }}
    </router-link>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@stores/user';

const userStore = useUserStore();
const user = ref('');

onMounted(async () => {
    await userStore.fetchUser();
    user.value = userStore.user.user_metadata.full_name;
    console.log(user.value);
});
</script>
  