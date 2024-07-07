<template>
<Container>
    <div class="flex items-center justify-between  mb-6">
        <h1 class="text-2xl font-bold">User Page</h1>
        <router-link to="users/create" class="btn !px-3 !py-2"><i class="fad fa-user-plus "></i>Add User</router-link>
    </div>
    <UserList/>
</Container>
</template>

<script setup>
import UserList from '@components/views/user/UserList.vue';
import Container from '@components/layout/Container.vue'
import { useTitle } from '@vueuse/core'
useTitle('Users - Lazyplay')

</script>