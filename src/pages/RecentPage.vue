<template>
    <Container>
        <div class="flex items-center justify-between  mb-6">
            <h1 class="text-2xl font-bold">Log Request</h1>
        </div>
        <RecentList />
    </Container>
</template>
    
<script setup>
import Container from '@components/layout/Container.vue'
import RecentList from '../components/recent/RecentList.vue';
import { useTitle } from '@vueuse/core'
useTitle('Log Request - Lazyplay')

</script>