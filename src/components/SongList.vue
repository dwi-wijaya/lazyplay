<template>
    <ul class="list-disc pl-5">
        <li v-for="song in songs" :key="song.play_id" class="mb-2">
            <a :href="song.url" target="_blank" class="text-blue-500">{{ song.url }}</a>
            <p>{{ song.note }}</p>
        </li>
    </ul>
</template>
  
<script>
export default {
    props: {
        songs: {
            type: Array,
            required: true,
        },
    },
}
</script>
  
<style scoped>
li {
    @apply mb-2;
}

a {
    @apply text-blue-500;
}
</style>
  