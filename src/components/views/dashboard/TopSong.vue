<template>
    <div class="">
        <h3 class="text-text text-lg flex gap-2 font-semibold items-center"><i class="text-primary fad fa-fire"></i>Top Pick
        </h3>
        <p class="text-subtext mb-4 text-sm">The most requested song track by users</p>

        <section class="flex flex-col bg-container border border-stroke rounded-lg p-3">
            <ul class=" rounded-md">
                <li v-for="(song, index) in songs" :key="song.id"
                    class="justify-between flex gap-2 p-3 !m-0 group items-center hover:bg-background  border-b border-stroke last:border-b-0 group/song">
                    <div class="flex gap-2 items-center">
                        <p class="mr-3 text-subtext font-semibold">{{ index + 1 }}</p>
                        <div class="w-20 relative">
                            <img :src="song.thumbnail" alt="" class="w-20 min-w-20 h-11 rounded-lg object-cover" srcset="">
                            <div
                                class="absolute rounded-lg text-white w-full base-transition gap-2 top-0 left-0 h-full bg-black opacity-0 transition-opacity duration-300 flex  group-hover/song:opacity-85 justify-center items-center">
                                <i class="fad fa-fire"></i> {{ song.count_song }}
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <a :href="song.url" target="_blank" class="!text-text font-semibold leading-5 line-clamp-1">
                                {{ song.title }}
                            </a>
                            <p class="text-neutral-400 text-sm line-clamp-1 text-subtext"><i
                                    class="fad fa-user-music text-xs mr-2"></i>{{
                                        song.artist }}</p>
                        </div>
                    </div>
                    <div class="flex mr-4">
                        <p class="">{{ parseDuration(song.duration) }}</p>

                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import { parseDuration } from '@helpers/durationHelper';
import { parseState } from '@helpers/stateHelper';

export default {
    props: {
        songs: {
            type: Array,
            required: true,
        },
    }, methods: {
        parseState,
        parseDuration
    }
}
</script>
  