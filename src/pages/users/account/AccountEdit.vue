<template>
    <BackButton :to="'/account'" />
    <div class="card !p-5">
        <form @submit.prevent="updateUser" class="flex flex-col gap-3">
            <div class="form-group">
                <label for="full_name">Full Name:</label>
                <input class="form-input" id="full_name" v-model="userMetadata.full_name" type="text" required>
            </div>
            <div class="form-group" v-if="!userMetadata.iss">
                <label for="email">Email:</label>
                <input class="form-input" id="email" v-model="user.email" type="email" required>
            </div>
            <p v-if="errorMessage" class="text-primary mt-2">{{ errorMessage }}</p>
            <div class="flex justify-end">
                <button type="submit" class="btn mt-4"><i class="fad fa-pen"></i>Update</button>
            </div>
        </form>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@services/supabase.js'; // sesuaikan path sesuai struktur proyek Anda
import BackButton from '@components/partial/BackButton.vue';

const route = useRoute();
const router = useRouter();
const user = ref({});
const userMetadata = ref({});
const errorMessage = ref('');
import { useUserStore } from '@stores/user';

const fetchUser = async () => {
    const userStore = useUserStore();
    await userStore.fetchUser();
    user.value = userStore.user;
    userMetadata.value = userStore.user.user_metadata
};

const updateUser = async () => {
    const { error } = await supabase.auth.updateUser({
        email: user.value.email,
        data: {
            full_name: userMetadata.value.full_name,
        }
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
</script>
  