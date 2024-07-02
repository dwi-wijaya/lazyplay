<template>
    <button @click="signOut"
        class="flex gap-3 items-center bg-background border border-stroke px-5 py-3 rounded-2xl text-base">
        <i class="text-primary fad fa-arrow-left-from-bracket"></i> Sign-out 
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { supabase } from '@services/supabase'; // Adjust the import according to your project structure

const router = useRouter();

const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert('Error signing out: ' + error.message);
    } else {
        alert('Signed out successfully');
        router.push('/signin');
    }
};
</script>
