<template>
    <div class="w-full sm:max-w-64 md:max-w-72 xl:max-w-80 h-full sm:h-[calc(100vh-5rem)] pb-6">
        <div class="bg-container rounded-2xl p-4 lg:p-5 border border-stroke h-full">
            <div class="group">
                <p class="mb-2 text-text">
                    <i :class="['text-sm mr-2', stateIcon(currentSong.status)]"></i>
                    {{ parseState(currentSong.status) }}
                </p>

                <div class="rounded-xl h-full w-full aspect-square relative overflow-hidden">
                    <img v-if="currentSong.thumbnail" :src="currentSong.thumbnail" alt="" srcset=""
                        class="w-full h-full scale-[1.35] object-cover">
                </div>
                <div v-if="!currentSong.thumbnail" class=" h-48 w-full animate-pulse">
                    <div class="bg-background h-full border border-stroke rounded-xl flex justify-center items-center">
                        <i class="text-2xl fal fa-music-magnifying-glass"></i>
                    </div>
                </div>
                <div class="flex justify-between items-end">
                    <div class="">
                        <p class="text-text line-clamp-1 mt-2 font-semibold" :title="currentSong.title">{{ currentSong ?
                            currentSong.title : '-' }}</p>
                        <p class="text-subtext text-sm text-neutral-400 line-clamp-1 flex items-center">
                            <i class="fad fa-user-music mr-2"></i>
                            <span class="line-clamp-1 group-hover:hidden">{{ currentSong ? currentSong.artist : '-'
                            }}</span>
                            <span class="line-clamp-1 hidden group-hover:block">{{ currentSong ? currentSong.created_name :
                                '-' }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 mt-5 mb-3 items-center">
                <p class="text-subtext text-sm"><i class="fad fa-list-music mr-2"></i> Queue ({{ upcomingSongs.length }})
                </p>
                <hr class="flex-1 border border-stroke">
            </div>
            <ul
                class="flex flex-col gap-3 h-[calc(100vh-37.75rem)] sm:h-[calc(100vh-31rem)] md:h-[calc(100vh-33.25rem)] lg:h-[calc(100vh-32.95rem)] xl:h-[calc(100vh-35.25rem)] overflow-auto scrollbar-hide">
                <p v-if="upcomingSongs.length == 0" class="text-subtext text-sm">The Queue are currently empty !</p>
                <li class="group flex gap-2 px-0" v-for="(song, index) in upcomingSongs" :key="song.id" :title="song.title">
                    <div class=" !w-12 !h-12 relative ">
                        <img :src="song.artist_image" alt="" srcset="" class="rounded-lg object-cover min-w-12 !w-12 !h-12">
                        <div
                            class="base-transition bg-black opacity-0 group-hover:opacity-70 rounded-lg absolute top-0 left-0 w-full h-full">
                        </div>
                        <div
                            class="base-transition opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-lg absolute top-0 left-0 w-full h-full">
                            {{ index + 1 }}</div>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-text line-clamp-1 ">{{ song.title }}</p>
                        <p class="text-subtext text-sm text-neutral-400  flex items-center base-transition line-clamp-1">
                            <i class="fad fa-user-music mr-2"></i>
                            <span class="line-clamp-1 group-hover:hidden">{{ song.artist }}</span>
                            <span class="line-clamp-1 hidden group-hover:block"> {{ song.created_name }}</span>
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