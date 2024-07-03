<template>
    <div>
        <BackButton :to="'/'" />
        <div class="flex justify-between">
            <h1 class="font-medium text-lg">User Details</h1>
            <div class="flex gap-2">
                <router-link title="change password" to="/change-password" class="btn !px-3 !py-2"><i class="fad fa-lock"></i><span class="hidden sm:block">Change Password</span></router-link>
                <router-link title="update account" to="/account-edit" class="btn !px-3 !py-2"><i class="fad fa-pen"></i><span class="hidden sm:block">Update Account</span></router-link>
            </div>
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
  