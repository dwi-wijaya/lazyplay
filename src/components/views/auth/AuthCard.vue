<template>
    <div class="flex justify-center items-center min-h-screen">
        <div class="sm:card bg-none p-5 sm:w-[35rem] w-[23.5rem] !rounded-3xl gap-4 sm:!p-7">
            <div class="header text-center">
                <img src="@assets/logos/logo.png" class="w-16 block mx-auto" alt="logo">
                <h3 class="text-text text-2xl font-bold mt-4">Welcome Back</h3>
                <p class="text-subtext">Please enter your details to sign-in.</p>
            </div>
            <div class="flex gap-2 justify-center mt-4">
                <button class="!border-neutral-300 card group hover:!bg-neutral-100 !bg-neutral-50 flex justify-center items-center w-28"
                    @click="signInWithProvider('github')">
                    <img class="w-6 group-hover:-rotate-12 duration-300 transition-all" src="@assets/logos/github.svg" alt="GitHub">
                </button>
                <button class="!border-neutral-300 card group group/card hover:!bg-neutral-100 flex !bg-neutral-50 justify-center items-center w-28"
                    @click="signInWithProvider('google')">
                    <img class="w-6 group-hover:-rotate-12 duration-300 transition-all" src="@assets/logos/google.svg" alt="Google">
                </button>
                <button class="!border-neutral-300 card group group/card hover:!bg-neutral-100 flex !bg-neutral-50 justify-center items-center w-28"
                    @click="signInWithProvider('twitter')">
                    <img class="w-6 group-hover:-rotate-12 duration-300 transition-all" src="@assets/logos/twitter.svg" alt="Twitter">
                </button>
            </div>
            <div class="divider flex items-center gap-4 my-5">
                <hr class="border border-stroke flex-1">
                OR
                <hr class="border border-stroke flex-1">
            </div>
            <slot />
        </div>
    </div>
</template>
  
<script setup>
import { supabase } from '@services/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

const signInWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
        alert('Error: ' + error.message);
    } else {
        router.push('/');
    }
};
</script>
