<template>
    <div class="w-full sm:max-w-64 min-h-[40vh] pb-6">
        <div class="bg-container rounded-2xl p-4 lg:p-6 border border-stroke h-full">

            <p class="mb-3">
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
                    <p class="text-text line-clamp-1 mt-3 font-semibold">{{ currentSong ? currentSong.title : '-' }}</p>
                    <p class="text-subtext text-sm text-neutral-400">
                        <i class="fad fa-user-music mr-2"></i>
                        {{ currentSong ? currentSong.artist : '-' }}
                    </p>
                </div>
                <i class="fad fa-list-music"></i>
            </div>
            <hr class="my-4 border border-stroke">
            <ul class="flex flex-col gap-3">
                <li class="flex gap-2 px-0" v-for="(song, index) in upcomingSongs" :key="song.id">
                    <img :src="song.artist_image" alt="" srcset="" class="rounded-lg object-cover !w-12">
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
import { parseState, stateIcon } from '../helpers/stateHelper';


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