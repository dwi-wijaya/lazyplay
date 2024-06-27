<template>
    <section class="list-disc pl-5 grid grid-cols-4">
        <div v-for="song in songs" :key="song.play_id" class="mb-2">
            <a :href="song.url" target="_blank" class="text-blue-500">{{ song.title }}</a>
            <img :src="song.thumbnail" alt="">
            <p></p>
            <p>{{ song.note }}</p>
        </div>
    </section>
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

</style>
