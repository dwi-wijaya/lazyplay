<template>
    <h3 class="text-text text-lg mt-6 flex gap-2 font-semibold items-center"><i class="text-primary fad fa-microphone"></i>Top Artist
    </h3>
    <p class="text-subtext mb-4 text-sm">Artist with the most songs requested by users</p>
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
        <div v-for="artist in artists" :key="artist.index"
            class="group/artist mb-2 flex flex-col justify-start  base-transition">
            <div class="w-full relative  mb-2">
                <img :src="artist.artist_image" alt="" class="rounded-xl w-full">
                <div
                    class="hidden absolute text-primary rounded-xl text-white w-full base-transition gap-2 top-0 left-0 h-full bg-black opacity-75 group-top-artist-hover group-hover/artist:flex justify-center items-center">
                    <i class="fad fa-fire text-primary"></i> {{ artist.count_artist }}
                </div>
            </div>
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

