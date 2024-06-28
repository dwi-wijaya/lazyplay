<template>
    <ul class="list-disc pl-5">
        <li v-for="song in songs" :key="song.play_id" class="mb-2">
            <a :href="song.url" target="_blank" class="text-blue-500">{{ song.title }} - {{ parseState(song.status) }}</a>
            <p>{{ song.note }} </p>
            <button @click="$emit('delete-song', song.id)" class="text-red-500">Delete</button>
        </li>
    </ul>
</template>
  
<script>
import { parseState } from '../helpers/stateHelper';

export default {
    props: {
        songs: {
            type: Array,
            required: true,
        },
    },methods: {
        parseState
    }
}
</script>
  
<style scoped>
li {
    @apply mb-2;
}

a {
    @apply text-blue-500;
}

button {
    @apply text-red-500;
}
</style>
