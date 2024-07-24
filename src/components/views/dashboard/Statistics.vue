<!-- CardWrap.vue -->
<template>
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 gap-y-6">
        <StatCard :value="totalRequest" label="Total request" iconClass="fad fa-list-music" />
        <StatCard :value="myRequest" label="My request" iconClass="fad fa-user-music" />
        <StatCard :value="uniqueSong" label="Unique Song" iconClass="fad fa-music-note" />
        <StatCard :value="uniqueArtist" label="Unique Artist" iconClass="fad fa-microphone" />
    </div>
</template>
  
<script setup>
import { defineProps } from 'vue';
import StatCard from './StatCard.vue';

const props = defineProps({
    totalRequest: Number,
    myRequest: Number,
    uniqueSong: Number,
    uniqueArtist: Number,
});
</script>
