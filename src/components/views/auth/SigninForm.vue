<template>
    <form @submit.prevent="signIn" class="flex flex-col gap-3">
        <div class="form-group">
            <label for="email" class="font-medium text-text text-base">Email Address</label>
            <input v-model="email" type="email" :class="{ 'border-red-500': errorMsg }"
                class="form-input !bg-slate-50 dark:!bg-[#323946] !rounded-md" id="email" required>
        </div>
        <div class="form-group">
            <label for="password" class="font-medium text-text text-base">Password</label>
            <input v-model="password" type="password" :class="{ 'border-red-500': errorMsg }"
                class="form-input !bg-slate-50 dark:!bg-[#323946] !rounded-md" id="password" required>
        </div>
        <small class="text-red-500" v-if="errorMsg">{{ errorMsg }}</small>
        <div class="flex justify-between mt-2">
            <div>
                <input v-model="rememberMe" type="checkbox" class="accent-primary"> Remember Me
            </div>
            <router-link to="/forgot-password" class="font-semibold underline underline-offset-2">
                Forgot Password
            </router-link>
        </div>
        <button type="submit" class="btn !block !w-full !rounded-lg" :disabled="isLoading">
            <span v-if="isLoading"><i class="fad fa-spinner-third fa-spin"></i> Loading...</span>
            <span v-else>Sign-in</span>
        </button>
        <p class="text-center mt-3">Don't have an account yet?
            <router-link to="/signup" class="font-semibold underline underline-offset-2">Sign-up</router-link>
        </p>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@services/supabase'; // Adjust the import according to your project structure

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);


const signIn = async () => {
    isLoading.value = true;
    errorMsg.value = '';
    const { user, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });
    isLoading.value = false;

    if (error) {
        console.log(error.message);
        errorMsg.value = error.message;
        // error.value = error;
    } else {
        router.push('/');
    }
};
</script>
