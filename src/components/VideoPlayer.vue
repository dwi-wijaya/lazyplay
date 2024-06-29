<template>
    <div>
        <iframe class="rounded-xl w-full h-[30rem]" ref="player" :src="videoUrlWithParams"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameborder="0">
        </iframe>
        <div class="flex justify-between gap-2 my-4 p-2 bg-container border border-stroke rounded-lg">
            <div class="flex gap-2">
                <img :src="song.artist_image" alt="" srcset="" class="w-12 h-12 rounded-md object-cover">
                <div class="flex flex-col">
                    <p class="line-clamp-1">
                        {{ song.title }} 
                        <span class="py-1  px-2 bg-neutral-200 rounded-lg ml-1">
                            {{ parseDuration(song.duration) }}
                        </span>
                    </p>
                    <p class=" text-sm text-neutral-400 line-clamp-1">
                        <i class="fad fa-user-music mr-1"></i>
                        {{ song.artist }}
                    </p>
                </div>

            </div>
            <div class="flex gap-2 items-center mr-1">
                <button class="btn !px-3 !py-2 h-fit" @click="$emit('prev-song')"><i class="fad fa-backward"></i></button>
                <button class="btn !px-3 !py-2 h-fit" @click="playVideo"><i class="fad fa-play"></i></button>
                <button class="btn !px-3 !py-2 h-fit" @click="pauseVideo"><i class="fad fa-pause"></i></button>
                <button class="btn !px-3 !py-2 h-fit" @click="stopVideo"><i class="fad fa-stop"></i></button>
                <button class="btn !px-3 !py-2 h-fit" @click="$emit('skip-song')"><i class="fad fa-forward"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
import { parseDuration } from '../helpers/durationHelper';

export default {
    props: {
        song: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            player: null,
        };
    },
    computed: {
        videoUrlWithParams() {
            return `${this.song.url}?autoplay=1&enablejsapi=1`;
        },
    },
    mounted() {
        this.loadYouTubeIframeAPI();
    },
    watch: {
        videoUrl() {
            this.reloadYouTubePlayer();
        },
    },
    methods: {
        parseDuration,
        loadYouTubeIframeAPI() {
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = () => {
                    this.initYouTubePlayer();
                };
            } else {
                this.initYouTubePlayer();
            }
        },
        initYouTubePlayer() {
            this.player = new window.YT.Player(this.$refs.player, {
                events: {
                    onReady: this.onPlayerReady,
                    onStateChange: this.onPlayerStateChange,
                },
            });
        },
        reloadYouTubePlayer() {
            if (this.player) {
                this.player.destroy();
            }
            this.initYouTubePlayer();
        },
        onPlayerReady(event) {
            console.log('Player ready');
        },
        onPlayerStateChange(event) {
            if (event.data !== window.YT.PlayerState.BUFFERING) {
                console.log('Video state changed');
                this.$emit('video-state', event.data);
            }
        },
        playVideo() {
            if (this.player && this.player.playVideo) {
                this.player.playVideo();
            }
        },
        pauseVideo() {
            if (this.player && this.player.pauseVideo) {
                this.player.pauseVideo();
            }
        },
        stopVideo() {
            if (this.player && this.player.stopVideo) {
                this.player.stopVideo();
            }
        },
    },
};
</script>