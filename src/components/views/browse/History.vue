<template>
    <div class="">
        <div class="flex items-end justify-between mb-4">
            <div class="flex gap-2">
                <img :src="user?.user_metadata.avatar_url" alt="" class="w-12 h-12 sm:w-14 sm:h-14 rounded-md">
                <div class="flex flex-col justify-between">
                    <h2 class="leading-5 text-base text-subtext font-medium">Hii, {{ user?.user_metadata.full_name }}</h2>
                    <h3 class="text-2xl sm:text-4xl font-bold">Request again</h3>
                </div>
            </div>
            <div class="flex gap-2 mb-1">
                <router-link to="listen-again" class="btn !text-sm !px-3 !py-1">
                    Others
                </router-link>
                <div class="hidden gap-1 sm:flex">
                    <button @click="prev" :disabled="isFirstSlide"
                        class="btn disabled:!bg-red-400 dark:disabled:!bg-red-300 !text-sm !px-3 !py-1">
                        <i class="fad fa-chevron-left"></i>
                    </button>
                    <button @click="next" :disabled="isLastSlide"
                        class="btn disabled:!bg-red-400 dark:disabled:!bg-red-300 !text-sm !px-3 !py-1">
                        <i class="fad fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        <Carousel ref="carousel" :breakpoints="breakpoints" :itemsToScroll="1">
            <Slide v-for="(video, index) in userHistory" :key="index" class="pr-4">
                <div class="group !relative !flex !flex-col !aspect-square">
                    <div class="duration-500 relative h-full rounded-xl overflow-hidden">
                        <img :src="video.thumbnail" :alt="video.title"
                            class="object-cover w-full h-full transform transition-transform duration-300 scale-[1.35] group-hover:scale-[1.5] group-hover:blur-sm" />
                        <div
                            class="absolute z-10 top-0 left-0 flex flex-col gap-2 justify-center items-center w-full h-[calc(100%-3.75rem)]">
                            <button @click="AddToQueue(video)" :disabled="isCooldown || isDisable"
                                class="!w-36 justify-center btn z-10 opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed">
                                <i class="fad fa-signal-stream"></i>
                                {{
                                    isCooldown
                                    ? `(${cooldownTime}s)`
                                    : 'Request'
                                }}
                            </button>
                            <button @click="copyToClipboard(video.id, index)" :disabled="isCooldown"
                                class="!w-36 justify-center btn z-10 opacity-0 group-hover:opacity-100">
                                <i :class="state.clipboardIcon[index] ?? 'fad fa-clipboard'"></i>
                                {{ state.clipboardText[index] ?? 'Copy' }}
                            </button>
                            <div
                                class="absolute top-0 left-0 bg-black opacity-0 group-hover:opacity-50 base-transition w-full h-full">
                            </div>
                        </div>
                        <div
                            class="absolute inset-0 bg-gradient-to-b from-black/0 to-black opacity-90 transition-opacity duration-300">
                        </div>
                    </div>
                    <div class="absolute px-4 py-3 space-y-4 w-full bottom-0 h-15 backdrop-blur-sm rounded-b-2xl">
                        <div class="flex gap-2">
                            <img :src="video.artist_image" class="w-8 h-8 rounded-md" alt="">
                            <div class="flex flex-col">
                                <h3 class="text-left line-clamp-1 leading-5 font-medium text-neutral-200 ">
                                    {{ video.title }}
                                </h3>
                                <p class="text-xs text-left line-clamp-1 m-0 text-neutral-400">{{ video.artist }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Slide>
        </Carousel>
    </div>
</template>
  
<script>
import { ref } from 'vue';
import { useClipboard } from "@vueuse/core";
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

export default {
    components: {
        Carousel,
        Slide
    },
    props: {
        user: {
            type: Object,
            required: true
        },
        userHistory: {
            type: Array,
            required: true
        },
        isCooldown: {
            type: Boolean,
            required: true
        },
        isDisable: {
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
    },
    computed: {
        isFirstSlide() {
            return this.currentSlide === this.minSlide || this.currentSlide === 0;
        },
        isLastSlide() {
            return this.currentSlide >= (this.userHistory.length - 1);
        }
    },
    data() {
        return {
            state: {
                clipboardText: this.userHistory.map(() => 'Copy'),
                clipboardIcon: this.userHistory.map(() => 'fad fa-clipboard')
            },
            breakpoints: {
                // 700px and up
                0: {
                    itemsToShow: 1,
                    snapAlign: 'end',
                },
                600: {
                    itemsToShow: 2,
                    snapAlign: 'end',
                },
                768: {
                    itemsToShow: 3,
                    snapAlign: 'end',
                },
                1024: {
                    itemsToShow: 4,
                    snapAlign: 'end',
                },
                1280: {
                    itemsToShow: 4,
                    snapAlign: 'end',
                },
                1536: {
                    itemsToShow: 5,
                    snapAlign: 'end',
                },
            },
            currentSlide: 0,
            minSlide: 0
        };
    },
    methods: {
        prev() {
            this.$refs.carousel.prev();
            this.minSlide = this.$refs.carousel.data.minSlide.value;
            this.currentSlide = this.$refs.carousel.data.currentSlide.value;
        },
        next() {
            this.$refs.carousel.next();
            this.minSlide = this.$refs.carousel.data.minSlide.value;
            this.currentSlide = this.$refs.carousel.data.currentSlide.value;
        },
        updateSlide(slide) {
            this.currentSlide = slide;
        },
        async AddToQueue(song) {
            if (!this.isCooldown) {
                const data = {
                    url: song.url,
                    title: song.title,
                    duration: song.duration,
                    thumbnail: song.thumbnail,
                    channelTitle: song.artist,
                    channelImage: song.artist_image
                };
                this.$emit("add-to-queue", data);
            }
        },
        async copyToClipboard(videoId, index) {
            const { copy, copied } = useClipboard();
            await copy(`https://music.youtube.com/watch?v=${videoId}`);
            if (copied.value) {
                this.state.clipboardText[index] = 'Copied';
                this.state.clipboardIcon[index] = 'fad fa-check';
                setTimeout(() => {
                    this.state.clipboardText[index] = 'Copy';
                    this.state.clipboardIcon[index] = 'fad fa-clipboard';
                }, 3000);
            }
        }
    }
};
</script>
  
<style>
/* Add your custom styles if needed */
</style>
  