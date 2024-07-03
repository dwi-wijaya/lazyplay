<template>
    <router-link 
        to="/account" 
        :class="{'text-primary': isActiveRoute}"
        class="group flex gap-3 items-center bg-background border border-stroke px-5 py-3 rounded-2xl text-base hover:text-primary"
    >
        <i class="fad fa-user-headset group-hover:-rotate-[8deg] transition-300 duration-300 transition-all"></i> 
        {{ user }}
    </router-link>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@stores/user';

const userStore = useUserStore();
const user = ref('');
const router = useRouter();

const isActiveRoute = computed(() => {
    return router.currentRoute.value.path === '/account';
});

onMounted(async () => {
    await userStore.fetchUser();
    user.value = userStore.user?.user_metadata.full_name;
});
</script>
