<template>
    <section class="list-disc flex flex-col bg-container border border-stroke rounded-lg p-2">
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
                    <button @click="$emit('delete-song', song.id)"
                        class="text-primary border px-3 py-2 border-stroke bg-container rounded-md hidden  group-hover:flex gap-2 items-center"><i
                            class="fad fa-trash"></i>Delete
                    </button>
                    <div class="relative group/btn">
                        <button @click="$emit('add-to-queue', song)" :disabled="isCooldown || disableAddButton"
                            class="text-primary border px-3 py-2 border-stroke bg-container rounded-md hidden group-hover:flex gap-2 items-center disabled:cursor-not-allowed">
                            <i v-if="!isCooldown" class="fad fa-signal-stream"></i>
                            <i v-else class="fad fa-hourglass"></i>
                            {{ isCooldown ? cooldownTime + 's' : 'Add to queue' }}
                        </button>
                        <span v-if="disableAddButton"
                            class="absolute right-0 w-[17rem] border border-stroke top-12 hidden base-transition group-hover/btn:block bg-container text-sm rounded py-1 px-2 z-20">
                            {{ this.disableMsg }}
                        </span>
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
        }
    },
    data() {
        return {
            disableMsg: ''
        }
    },
    computed: {
        disableAddButton() {
            if (dayjs().format('HH:MM') <= '07:20') {
                this.disableMsg = 'Requests will be available starting at 07:20 AM. Please check back then.'
                return true
            } else if (this.userQueue.length >= 4) {
                this.disableMsg = 'You have reached the maximum number of requests. Please wait for your songs to be played before adding more.'
                return true
            }
        }
    },
    methods: {
        parseState,
        parseDuration
    }
}
</script>
