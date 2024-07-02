<template>
    <Container>
        <div class="flex items-center justify-between  mb-6">
            <h1 class="text-2xl font-bold">User Page</h1>
            <button class="btn !px-3 !py-2"><i class="fad fa-user-plus "></i>Add User</button>
        </div>
        <RecentList />
    </Container>
</template>
    
<script setup>
import Container from '@components/layout/Container.vue'
import RecentList from '../components/recent/RecentList.vue';

</script>