<template>
    <section class="list-disc flex flex-col">
        <ul class="rounded-md">
            <li v-for="song in playlist" :key="song.id"
                class="justify-between flex p-3 !m-0 group items-center hover:bg-background gap-2 border-b border-stroke last:border-b-0">
                <div class="flex gap-2 items-center">
                    <img :src="song.artist_image" width="50" height="50" alt="" class="rounded-lg" srcset="">
                    <div class="flex flex-col">
                        <a :href="song.url" target="_blank" class="line-clamp-1 !text-text leading-5">
                            {{ song.title }}
                        </a>
                        <p class="line-clamp-1 text-subtext text-sm"><i class="fad fa-user-music mr-2"></i>{{ song.artist }}
                        </p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <p
                        class="px-3 py-2 border border-stroke bg-background rounded-md group-hover:hidden flex gap-2 items-center">
                        <i class="fad fa-timer"></i>{{ parseDuration(song.duration) }}
                    </p>
                    <button @click="$emit('delete-song', song.id)" title="Delete"
                        class="text-primary border px-3 py-2 border-stroke bg-container rounded-md hidden  group-hover:flex gap-2 items-center"><i
                            class="fad fa-trash"></i><span class="hidden sm:block">Delete</span>
                    </button>
                    <div class="relative group/btn">
                        <button @click="$emit('add-to-queue', song)" :disabled="isCooldown || disableBtn" title="Add to queue"
                            class="text-primary border px-3 py-2 border-stroke bg-container rounded-md hidden group-hover:flex gap-2 items-center disabled:cursor-not-allowed">
                            <i v-if="!isCooldown" class="fad fa-signal-stream"></i>
                            <i v-else class="fad fa-hourglass"></i>
                            <span v-if="isCooldown">{{ cooldownTime + 's' }}</span>
                            <span class="hidden sm:block" v-else>Add to queue</span>
                        </button>
                    </div>

                </div>
            </li>
        </ul>
    </section>
</template>

<script>
import { parseDuration } from '@helpers/durationHelper';
import { parseState } from '@helpers/stateHelper';
import dayjs from 'dayjs';

export default {
    props: {
        playlist: {
            type: Array,
            required: true,
        },
        isCooldown: {
            type: Boolean,
            required: true,
        },
        disableBtn: {
            type: Boolean,
            required: true,
        },
        cooldownTime: {
            type: Number,
            required: true,
        },
        userQueue: {
            type: Array,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
    },
    methods: {
        parseState,
        parseDuration
    }
}
</script>
