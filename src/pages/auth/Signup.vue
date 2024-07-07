<template>
    <AuthCard>
        <SignupForm />
    </AuthCard>
</template>
<script setup>
import SignupForm from '@components/views/auth/SignupForm.vue';
import AuthCard from '@components/views/auth/AuthCard.vue';
import { useTitle } from '@vueuse/core'
useTitle('Signup - Lazyplay')
</script>