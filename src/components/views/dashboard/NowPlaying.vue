<template>
    <div class="w-full sm:max-w-64 md:max-w-72 xl:max-w-80 h-[calc(100vh-5rem)] pb-6">
        <div class="bg-container rounded-2xl p-4 lg:p-5 border border-stroke h-full">
            <p class="mb-2 text-text">
                <i :class="['text-sm mr-2', stateIcon(currentSong.status)]"></i>
                {{ parseState(currentSong.status) }}
            </p>

            <img v-if="currentSong.thumbnail" :src="currentSong.thumbnail" alt="" srcset=""
                class="rounded-xl object-none h-48 w-full">
            <div v-if="!currentSong.thumbnail"
                class="bg-background border border-stroke rounded-xl flex justify-center items-center h-48 w-full">
                <i class="text-2xl fal fa-music-magnifying-glass"></i>
            </div>
            <div class="flex justify-between items-end">
                <div class="">
                    <p class="text-text line-clamp-1 mt-2 font-semibold">{{ currentSong ? currentSong.title : '-' }}</p>
                    <p class="text-subtext text-sm text-neutral-400 line-clamp-1">
                        <i class="fad fa-user-music mr-2"></i>{{ currentSong ? currentSong.artist : '-' }}
                    </p>
                </div>
                
            </div>
            <div class="flex gap-2 mt-1 mb-4 items-center">
                <p class="text-subtext text-sm"><i class="fad fa-list-music mr-2"></i> Queue ({{ upcomingSongs.length }})</p>
                <hr class="flex-1 border border-stroke">
            </div>
            <ul class="flex flex-col gap-3 h-[calc(100vh-28.5rem)] lg:h-[calc(100vh-29rem)] overflow-auto scrollbar-hide">
                <li class="flex gap-2 px-0" v-for="(song, index) in upcomingSongs" :key="song.id">
                    <div class="group !w-12 !h-12 relative ">
                        <img :src="song.artist_image" alt="" srcset="" class="rounded-lg object-cover min-w-12 !w-12 !h-12">
                        <div class="base-transition bg-black opacity-0 group-hover:opacity-70 rounded-lg absolute top-0 left-0 w-full h-full"></div>
                        <div class="base-transition opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-lg absolute top-0 left-0 w-full h-full">{{ index+1 }}</div>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-text line-clamp-1 ">{{ song.title }}</p>
                        <p class="text-subtext text-sm text-neutral-400 line-clamp-1"><i class="fad fa-user-music mr-2"></i>{{
                            song.artist }}
                        </p>
                    </div>
                </li>
            </ul>

        </div>
    </div>
</template>

<script>
import { parseState, stateIcon } from '@helpers/stateHelper';


export default {
    props: {
        currentSong: {
            type: Object,
            required: true,
        },
        upcomingSongs: {
            type: Array,
            required: true,
        },
    }, methods: {
        parseState,
        stateIcon
    }
}
</script>