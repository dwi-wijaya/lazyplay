<template>
    <h3 class="mt-6 flex gap-2 font-semibold items-center"><i class="text-primary fad fa-fire"></i>Top Pick</h3>
    <p class="mb-4 text-sm">The most requested song track by users</p>

    <section class="flex flex-col bg-container border border-stroke rounded-lg p-3">
        <ul class=" rounded-md">
            <li v-for="(song, index) in songs" :key="song.id"
                class="justify-between flex p-3 !m-0 group items-center hover:bg-background  border-b border-stroke">
                <div class="flex gap-2 items-center">
                    <p class="mr-3 text-neutral-300 font-semibold">{{ index + 1 }}</p>
                    <img :src="song.thumbnail" width="80" height="45" alt="" class="w-20 h-11 rounded-lg object-cover"
                        srcset="">
                    <div class="flex flex-col">
                        <a :href="song.url" target="_blank" class="!text-neutral-600 font-semibold leading-5">
                            {{ song.title }}
                        </a>
                        <p class="text-neutral-400 text-sm flex items-center gap-1"><i
                                class="fad fa-user-music text-xs"></i>{{ song.artist }}</p>
                    </div>
                </div>
                <div class="flex mr-4">
                    <p class="">{{ parseDuration(song.duration) }}</p>

                </div>
            </li>
        </ul>
    </section>
</template>

<script>
import { parseDuration } from '../helpers/durationHelper';
import { parseState } from '../helpers/stateHelper';

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
  