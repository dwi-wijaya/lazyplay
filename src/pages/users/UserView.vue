<template>
    <div>
        <BackButton :to="'/users'" />
        <h1>User Details</h1>
        <div class="mt-4">
            <p><strong>Full Name:</strong> {{ user?.user_metadata?.full_name || user?.name }}</p>
            <p><strong>Email:</strong> {{ user?.email }}</p>
            <p><strong>Role:</strong> {{ user?.user_metadata?.role || 'public' }}</p>
            <p><strong>Last Sign In At:</strong> {{ formattedLastSignInAt }}</p>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { adminSupabase } from '@services/supabase'; // Adjust path according to your project structure
import { useDateFormat, useTitle } from '@vueuse/core';
import BackButton from '@components/partial/BackButton.vue';

const route = useRoute();
const user = ref(null);

const fetchUser = async () => {
    const userId = route.params.id;
    const { data, error } = await adminSupabase.auth.admin.getUserById(userId);
    if (error) {
        console.error('Error fetching user:', error);
    } else {
        user.value = data.user;
    }
};

onMounted(async () => {
    await fetchUser();
});

const formattedLastSignInAt = computed(() => {
    return user.value?.last_sign_in_at
        ? useDateFormat(user.value.last_sign_in_at, 'DD MMM, YYYY - HH:mm').value
        : '';
});

useTitle(computed(() => 'View - ' + (user.value?.user_metadata?.full_name || 'User')));
</script>
  