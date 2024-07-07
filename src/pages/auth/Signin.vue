<template>
    <AuthCard>
        <SigninForm />
    </AuthCard>
</template>
<script setup>
import SigninForm from '@components/views/auth/SigninForm.vue';
import AuthCard from '@components/views/auth/AuthCard.vue';
import { useTitle } from '@vueuse/core'
useTitle('Signin - Lazyplay')
</script>