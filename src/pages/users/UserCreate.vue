<template>
    <BackButton :to="'/users'" />
    <div class="card !p-5">
        <form @submit.prevent="createUser" class="flex flex-col gap-2">
            <div class="form-group">
                <label for="full_name">Full Name:</label>
                <input class="form-input" id="full_name" v-model="userMetadata.full_name" type="text" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input class="form-input" id="email" v-model="user.email" type="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input minlength="6" class="form-input" id="password" v-model="user.password" type="password" required>
            </div>
            <div class="form-group">
                <label for="confirm_password">Confirm Password:</label>
                <input minlength="6" class="form-input" id="confirm_password" v-model="confirmPassword" type="password" required>
            </div>
            <div class="flex gap-4">
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
                <button type="submit" class="btn mt-4"><i class="fad fa-user-plus"></i>Create</button>
            </div>
            <p v-if="errorMessage" class="text-primary mt-2">{{ errorMessage }}</p>
        </form>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminSupabase } from '@/services/supabase.js'; // sesuaikan path sesuai struktur proyek Anda
import BackButton from '@/components/partial/BackButton.vue'; // sesuaikan path sesuai struktur proyek Anda

const router = useRouter();
const user = ref({ email: '', password: '' });
const confirmPassword = ref('');
const userMetadata = ref({ full_name: '', role: 'operator' });
const errorMessage = ref('');

const createUser = async () => {
    if (user.value.password !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
    }

    let isOperator = false;
    let isAdmin = false;

    if (userMetadata.value.role === 'operator') {
        isOperator = true;
    } else if (userMetadata.value.role === 'admin') {
        isAdmin = true;
    }

    const { error } = await adminSupabase.auth.admin.createUser({
        email: user.value.email,
        password: user.value.password,
        user_metadata: {
            full_name: userMetadata.value.full_name,
            is_operator: isOperator,
            is_admin: isAdmin
        }
    });

    if (error) {
        errorMessage.value = `Error creating user: ${error.message}`;
        console.error('Error creating user:', error);
    } else {
        console.log('User created successfully');
        router.push('/users');
    }
};
</script>
