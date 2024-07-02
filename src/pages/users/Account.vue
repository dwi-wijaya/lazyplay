<template>
    <div>
        <BackButton :to="'/'" />
        <div class="flex justify-between">
            <h1>User Details</h1> <router-link to="/account-edit" class="btn !px-3 !py-2">Update Account</router-link>
        </div>
        <div class="mt-4">
            <p><strong>Full Name:</strong> {{ user?.user_metadata.full_name || user?.name }}</p>
            <p><strong>Email:</strong> {{ user?.email }}</p>
            <p><strong>Role:</strong> {{ user?.user_metadata.role }}</p>
            <p><strong>Last Sign In At:</strong> {{ formattedLastSignInAt }}</p>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDateFormat } from '@vueuse/core';
import BackButton from '@components/partial/BackButton.vue';
import { useUserStore } from '@stores/user';

const route = useRoute();
const user = ref(null);

const fetchUser = async () => {
    const userStore = useUserStore();
    await userStore.fetchUser();
    user.value = userStore.user;
};

onMounted(async () => {
    await fetchUser();
});

const formattedLastSignInAt = useDateFormat(user.value?.last_sign_in_at, 'DD MMM, YYYY - HH:mm').value;
</script>
  