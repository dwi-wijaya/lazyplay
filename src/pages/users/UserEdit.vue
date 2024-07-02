<template>
    <BackButton :to="'/users'" />
    <div class="card !p-5">
        <form @submit.prevent="updateUser">
            <div class="form-group">
                <label for="full_name">Full Name:</label>
                <input class="form-input" id="full_name" v-model="userMetadata.full_name" type="text" required>
            </div>
            <div class="flex gap-4 mt-2">
                <div class="flex gap-2 items-center">
                    <input id="role-operator" name="role" v-model="userMetadata.role" type="radio" value="operator">
                    <label for="role-operator">Is Operator</label>
                </div>
                <div class="flex gap-2 items-center">
                    <input id="role-admin" name="role" v-model="userMetadata.role" type="radio" value="admin">
                    <label for="role-admin">Is Admin</label>
                </div>
            </div>
            <div class="flex justify-end">
                <button type="submit" class="btn mt-4"><i class="fad fa-pen"></i>Update</button>
            </div>
        </form>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminSupabase } from '@services/supabase.js'; // sesuaikan path sesuai struktur proyek Anda
import BackButton from '@components/partial/BackButton.vue';

const route = useRoute();
const router = useRouter();
const user = ref({});
const userMetadata = ref({ full_name: '', role: '' });

const fetchUser = async () => {
    const userId = route.params.id;
    const { data, error } = await adminSupabase.auth.admin.getUserById(userId);
    
    if (error) {
        console.error('Error fetching user:', error);
    } else {
        user.value = data.user;
        userMetadata.value.full_name = data.user.user_metadata.full_name || data.user.name;
        userMetadata.value.role = data.user.user_metadata.role
    }
};

const updateUser = async () => {
    const { error } = await adminSupabase.auth.admin.updateUserById(user.value.id, {
        email: user.value.email,
        user_metadata: {
            full_name: userMetadata.value.full_name,
            role: userMetadata.value.role
        }
    });

    if (error) {
        console.error('Error updating user:', error);
    } else {
        console.log('User updated successfully');
        router.push('/users');
    }
};

onMounted(async () => {
    await fetchUser();
});
</script>
  