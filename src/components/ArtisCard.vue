<template>
    <h3 class="mt-6 flex gap-2 font-semibold items-center"><i class="text-primary fad fa-microphone"></i>Top Artist</h3>
    <p class="mb-4 text-sm">Artist with the most songs requested by users</p>
    <div class="grid grid-cols-8 gap-4">
        <div v-for="artist in artists" :key="artist.index" class="mb-2 flex flex-col justify-start ">
            <img :src="artist.artistImage" alt="" class="rounded-3xl w-full mb-2">
            <p class="leading-5 text-center line-clamp-2 text-sm">{{ artist.artist }} </p>
        </div>
    </div>
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

