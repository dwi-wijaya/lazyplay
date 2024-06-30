<template>
    <h3 class="text-text text-lg mt-6 flex gap-2 font-semibold items-center"><i class="text-primary fad fa-list-music"></i>Recently Played</h3>
    <p class="text-subtext mb-4 text-sm">Songs that have been played recently</p>

    <section class="flex flex-col bg-container border border-stroke rounded-lg p-3">
        <ul class=" rounded-md">
            <li v-for="(song, index) in songs" :key="song.id"
                class="justify-between flex p-3 gap-2 !m-0 group items-center hover:bg-background  border-b border-stroke last:border-b-0">
                <div class="flex gap-2 items-center">
                    <p class="mr-3 text-neutral-300 font-semibold">{{ index + 1 }}</p>
                    <img :src="song.thumbnail" width="80" height="45" alt="" class="w-20 h-11 rounded-lg object-cover"
                        srcset="">
                    <div class="flex flex-col">
                        <a :href="song.url" target="_blank" class="!text-text font-semibold leading-5 line-clamp-1">
                            {{ song.title }}
                        </a>
                        <p class="text-neutral-400 text-sm line-clamp-1 text-subtext"><i
                                class="fad fa-user-music text-xs mr-2"></i>{{ song.artist }}</p>
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
import { parseDuration } from '@helpers/durationHelper';

export default {
    props: {
        songs: {
            type: Array,
            required: true,
        },
    }, methods: {
        parseDuration
    }
}
</script>
  