<template>
    <form @submit.prevent="signUp" class="flex flex-col gap-3">
        <div class="flex gap-3 items-center w-full">
            <div class="form-group flex-1">
                <label for="firstname" class="font-medium text-text text-base">First Name</label>
                <input v-model="firstName" type="text" class="form-input !border-neutral-300 !rounded-md w-full"
                    id="firstname" required>
            </div>
            <div class="form-group flex-1">
                <label for="lastname" class="font-medium text-text text-base">Last Name</label>
                <input v-model="lastName" type="text" class="form-input !border-neutral-300 !rounded-md w-full"
                    id="lastname" required>
            </div>
        </div>
        <div class="form-group">
            <label for="email" class="font-medium text-text text-base">Email Address</label>
            <input v-model="email" type="email" class="form-input !border-neutral-300 !rounded-md" id="email" required>
        </div>
        <div class="form-group">
            <label for="password" class="font-medium text-text text-base">Password</label>
            <input v-model="password" type="password" class="form-input !border-neutral-300 !rounded-md" id="password"
                required>
        </div>
        <div class="mt-2">
            <div>
                <input v-model="isOperator" type="checkbox"> As Operator
            </div>
            <div class="flex justify-between">
                <div>
                    <input v-model="rememberMe" type="checkbox"> Remember Me
                </div>
                <router-link to="/forgot-password" class="font-semibold underline underline-offset-2">
                    Forgot Password
                </router-link>
            </div>
        </div>
        <button type="submit" class="btn !block !w-full !rounded-lg">Sign-up</button>
        <p class="text-center mt-3">Already have an account?
            <router-link to="/signin" class="font-semibold underline underline-offset-2">Sign-in</router-link>
        </p>
    </form>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@services/supabase'; // adjust the import according to your project structure

const router = useRouter();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const isOperator = ref(false);
const rememberMe = ref(false);

const signUp = async () => {
    const { user, error } = await supabase.auth.signup({
        email: email.value,
        password: password.value,
    }, {
        data: {
            first_name: firstName.value,
            last_name: lastName.value,
            is_operator: isOperator.value,
        }
    });

    if (error) {
        alert(error.message);
    } else {
        alert('Check your email for verification link');
        router.push('/signin');
    }
};
</script>
