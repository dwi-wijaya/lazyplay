<template>
    <h3 class="text-text text-lg mt-6 flex gap-2 font-semibold items-center"><i
            class="text-primary fad fa-microphone"></i>Top Artist
    </h3>
    <p class="text-subtext mb-4 text-sm">Artist with the most songs requested by users</p>
    <div class="grid grid-cols-5 gap-2 sm:gap-4">
        <div v-for="artist in artists" :key="artist.index"
            class="group/artist mb-2 flex flex-col justify-start base-transition">
            <div class="w-full relative  mb-2 rounded-xl ">
                <img :src="artist.artist_image" alt="" class="w-full rounded-xl ">
                <div
                    class=" absolute top-0 left-0 w-full h-full rounded-xl bg-black opacity-0 transition-opacity duration-300 text-white group-hover/artist:opacity-90">
                </div>
                <div
                    class="flex gap-2 items-center justify-center absolute top-0 left-0 w-full h-full rounded-xl opacity-0 transition-opacity duration-300 text-white group-hover/artist:opacity-100">
                    <i class="fad fa-fire text-xl xl:text-3xl"></i> {{ artist.count_artist }}
                </div>
            </div>
            <p class="leading-5 text-center line-clamp-2 text-sm mx-1">{{ artist.artist }} </p>
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

