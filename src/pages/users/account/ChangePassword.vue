<template>
    <BackButton :to="'/account'" />
    <div class="card !p-5">
        <form @submit.prevent="updateUser">
            <div class="form-group">
                <label for="password">Password:</label>
                <input minlength="6" class="form-input" id="password" v-model="user.password" type="password" required>
            </div>
            <div class="form-group">
                <label for="confirm_password">Confirm Password:</label>
                <input minlength="6" class="form-input" id="confirm_password" v-model="confirmPassword" type="password"
                    required>
            </div>
            <p v-if="errorMessage" class="text-primary mt-2">{{ errorMessage }}</p>
            <div class="flex justify-end">
                <button type="submit" class="btn mt-4"><i class="fad fa-lock"></i>Save Password</button>
            </div>
        </form>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@services/supabase.js'; // sesuaikan path sesuai struktur proyek Anda
import BackButton from '@components/partial/BackButton.vue';
import { useTitle } from '@vueuse/core'

const route = useRoute();
const router = useRouter();
const user = ref({});
const confirmPassword = ref('');
const errorMessage = ref('');
import { useUserStore } from '@stores/user';

const fetchUser = async () => {
    const userStore = useUserStore();
    await userStore.fetchUser();
    user.value = userStore.user;
};

const updateUser = async () => {
    if (user.value.password !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
    }

    const { error } = await supabase.auth.updateUser({
        password: user.value.password,
    });

    if (error) {
        if (error.message === 'New password should be different from the old password.') {
            errorMessage.value = 'New password should be different from the old password';
        } else {
            errorMessage.value = 'Error updating user: ' + error.message;
        }
        console.error('Error updating user:', error);
    } else {
        console.log('User updated successfully');
        router.push('/account');
    }
};

onMounted(async () => {
    await fetchUser();
});
useTitle(computed(() => 'Change Password - ' + (user.value?.user_metadata?.full_name || 'User')));
</script>
  