<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        <div class="group relative flex flex-col min-h-56 w-full" v-for="(video, index) in videos" :key="index">
            <div class="duration-500 relative h-full rounded-xl overflow-hidden">
                <img :src="video.snippet.thumbnails.high.url" :alt="video.snippet.title"
                    class="object-none w-full h-full transform transition-transform duration-300 group-hover:scale-[1.275] group-hover:blur-sm scale-[1.4]" />
                <div class="absolute z-10 top-0 left-0 flex flex-col gap-2 justify-center items-center w-full h-full">
                    <button @click="AddToQueue(video)" :disabled="isCooldown || disableAddButton"
                        class="!w-52 justify-center btn z-10 opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed">
                        <i class="fad fa-signal-stream"></i>
                        {{
                            isCooldown
                            ? `Cooldown (${cooldownTime}s)`
                            : 'Add To Queue'
                        }}
                    </button>
                    <button @click="copyToClipboard(video.id, index)" :disabled="isCooldown"
                        class="!w-52 justify-center btn z-10 opacity-0 group-hover:opacity-100">
                        <i :class="state.clipboardIcon[index] ?? 'fad fa-clipboard'"></i>
                        {{ state.clipboardText[index] ?? 'Copy to clipboard' }}
                    </button>
                    <div
                        class="absolute top-0 left-0 bg-black opacity-0 group-hover:opacity-50 base-transition w-full h-full">
                    </div>
                </div>
                <div
                    class="absolute inset-0 bg-gradient-to-b from-black/30 to-black opacity-90 transition-opacity duration-300">
                </div>
            </div>
            <div class="absolute flex flex-col justify-end p-5 space-y-4 h-full w-full group-hover:hidden">
                <div class="flex flex-col justify-end">
                    <div class="flex flex-col space-y-3 text-neutral-300">
                        <h3
                            class="line-clamp-1 leading-5 !mt-1 font-medium text-neutral-200 group-hover:underline group-hover:underline-offset-4 ">
                            {{ video.snippet.title }}
                        </h3>
                        <div class="flex gap-1 items-center text-neutral-400 !mt-2">
                            <i class="fal fa-calendar text-xs"></i>
                            <span class="text-xs ml-0.5">{{
                                useDateFormat(video.snippet.publishedAt, 'DD MMM, YYYY ')
                            }}</span>
                        </div>
                        <hr class="border-t border-neutral-500 my-4" />
                        <div class="flex justify-between items-center text-neutral-400">
                            <div class="flex gap-2 items-center">
                                <i class="fal fa-user-circle text-sm"></i>
                                <small>{{ parseArtist(video.snippet) }}</small>
                            </div>
                            <div class="flex gap-2 items-center">
                                <span class="text-xs font-medium ml-0.5">{{
                                    parseDuration(video.contentDetails.duration)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import {
    parseState,
    stateIcon
} from "@helpers/stateHelper";
import {
    parseDuration
} from "@helpers/durationHelper";
import {
    useDateFormat,
    useClipboard
} from "@vueuse/core";
import {
    parseArtist,
    getChannelDetails
} from "@services/youtube.js";

export default {
    props: {
        videos: {
            type: Array,
            required: true
        },
        isCooldown: {
            type: Boolean,
            required: true
        },
        cooldownTime: {
            type: Number,
            required: true
        },
        userQueue: {
            type: Array,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        disableAddButton() {
            const userId = this.user.id;
            const userQueueCount = this.userQueue.filter(song => song.created_by === userId).length;
            return userQueueCount >= 4;
        }
    },
    data() {
        return {
            state: {
                clipboardText: this.videos.map(() => 'Copy to clipboard'),
                clipboardIcon: this.videos.map(() => 'fad fa-clipboard')
            }
        };
    },
    methods: {
        parseState,
        parseArtist,
        stateIcon,
        parseDuration,
        useDateFormat,
        async AddToQueue(video) {
            if (!this.isCooldown) {
                const artistName = parseArtist(video.snippet);
                const channelId = video.snippet.channelId;

                const channel = await getChannelDetails(channelId);

                const data = {
                    url: `https://www.youtube.com/embed/${video.id}`,
                    title: video.snippet.title,
                    duration: video.contentDetails.duration,
                    thumbnail: video.snippet.thumbnails.high.url,
                    channelTitle: artistName,
                    channelImage: channel.snippet.thumbnails.default.url
                };

                this.$emit("add-to-queue", data);
            }
        },
        async copyToClipboard(videoId, index) {
            const {
                copy,
                copied
            } = useClipboard();
            await copy(`https://music.youtube.com/watch?v=${videoId}`);

            if (copied.value) {
                this.state.clipboardText[index] = 'Copied!';
                this.state.clipboardIcon[index] = 'fad fa-check';
                setTimeout(() => {
                    this.state.clipboardText[index] = 'Copy to clipboard';
                    this.state.clipboardIcon[index] = 'fad fa-clipboard';
                }, 3000);
            }
        }
    }
};
</script>
