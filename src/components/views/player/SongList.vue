<template>
    <section class="list-disc flex flex-col bg-container border border-stroke rounded-lg p-2">
        <ul class=" rounded-md">
            <li v-for="song in songs" :key="song.play_id"
                class="justify-between flex p-3 !m-0 group items-center hover:bg-background gap-2 border-b border-stroke last:border-b-0">
                <div class="flex gap-2 items-center">
                    <img :src="song.artist_image" width="50" height="50" alt="" class="rounded-lg" srcset="">
                    <div class="flex flex-col">
                        <a :href="song.url" target="_blank" class="line-clamp-1 !text-text leading-5">
                            {{ song.title + " - " + parseState(song.status) }}
                        </a>
                        <p class="line-clamp-1 text-subtext text-sm flex items-center"><i class="fad fa-user-music mr-2"></i>
                            <span class="line-clamp-1 group-hover:hidden">{{ song.artist }}</span>
                            <span class="line-clamp-1 hidden group-hover:block"> {{ song.created_name }}</span>
                        </p>
                    </div>
                </div>
                <div class="flex">
                    <p class="px-3 py-2 border border-stroke bg-background rounded-md group-hover:hidden flex gap-2 items-center">
                        <i class="fad fa-timer"></i>{{ parseDuration(song.duration) }} 
                    </p>
                    <button @click="$emit('delete-song', song.id)"
                        class="text-primary border px-3 py-2 border-stroke bg-container rounded-md hidden  group-hover:flex gap-2 items-center"><i
                            class="fad fa-trash"></i>Delete
                    </button>
                </div>
            </li>
        </ul>
    </section>
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
