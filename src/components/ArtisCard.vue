<template>
    <ul class="list-disc pl-5">
        <li v-for="artist in artists" :key="artist.play_id" class="mb-2">
            <img :src="artist.artistImage" alt="">
            <p>{{ artist.artist }} </p>
        </li>
    </ul>
</template>
  
<script>
export default {
    props: {
        artists: {
            type: Array,
            required: true,
        },
    },
}
</script>

