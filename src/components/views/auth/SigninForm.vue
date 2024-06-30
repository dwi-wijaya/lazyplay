<template>
    <form @submit.prevent="signIn" class="flex flex-col gap-3">
        <div class="form-group">
            <label for="email" class="font-medium text-text text-base">Email Address</label>
            <input v-model="email" type="email" class="form-input !border-neutral-300 !rounded-md" id="email" required>
        </div>
        <div class="form-group">
            <label for="password" class="font-medium text-text text-base">Password</label>
            <input v-model="password" type="password" class="form-input !border-neutral-300 !rounded-md" id="password"
                required>
        </div>
        <div class="flex justify-between mt-2">
            <div>
                <input v-model="rememberMe" type="checkbox"> Remember Me
            </div>
            <router-link to="/forgot-password" class="font-semibold underline underline-offset-2">
                Forgot Password
            </router-link>
        </div>
        <button type="submit" class="btn !block !w-full !rounded-lg">Sign-in</button>
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
const rememberMe = ref(false);

const signIn = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });
    const localSession = await supabase.auth.getSession()
    console.log(localSession);
    if (error) {
        alert(error.message);
    } else {
        alert('Login successful');
        router.push('/');
    }
};
</script>
  