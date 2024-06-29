<template>
    <section class="list-disc flex flex-col bg-container border border-stroke rounded-lg p-3">
        <ul class=" rounded-md">
            <li v-for="song in songs" :key="song.play_id"
                class="justify-between flex p-3 !m-0 group items-center hover:bg-background  border-b border-stroke">
                <div class="flex gap-2 items-center">
                    <img :src="song.artist_image" width="50" height="50" alt="" class="rounded-lg" srcset="">
                    <div class="flex flex-col">
                        <a :href="song.url" target="_blank" class="!text-neutral-600 font-semibold leading-5">
                            {{ song.title + " - " + parseState(song.status) }}
                        </a>
                        <p>{{ song.artist }}</p>
                    </div>
                </div>
                <div class="flex mr-4">
                    <p class="group-hover:hidden ">{{ parseDuration(song.duration) }}</p>
                    <button @click="$emit('delete-song', song.id)"
                        class="text-red-500 hidden  group-hover:flex gap-1 items-center"><i
                            class="fad fa-trash"></i>Delete</button>
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
  
<style scoped>
li {
    @apply mb-2;
}

a {
    @apply text-blue-500;
}

button {
    @apply text-red-500;
}
</style>
