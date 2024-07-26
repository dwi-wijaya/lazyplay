<template>
    <div class="p-5 rounded-xl border border-stroke bg-container">
        <iframe class="border border-stroke rounded-xl w-full h-72 sm:h-[30rem] " ref="player" :src="videoUrlWithParams"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" frameborder="0">
        </iframe>
        <div class="flex justify-between gap-3 mt-5 flex-col sm:flex-row">
            <div class="flex gap-2">
                <img :src="song.artist_image" alt="" class="w-12 h-12 rounded-md object-cover">
                <div class="flex flex-col">
                    <p class="line-clamp-1 font-semibold">{{ song.title }}</p>
                    <p class="text-sm text-text line-clamp-1">
                        <i class="text-subtext fad fa-user-music mr-1"></i>
                        {{ song.artist }}
                    </p>
                </div>
            </div>
            <div class="flex gap-1 sm:gap-2 border-t pt-3 sm:border-t-0 sm:pt-0 items-center mr-1 justify-between sm:justify-start">
                <button class="btn !px-3 !py-2 h-fit">
                    <i class="fad fa-timer"></i>{{ parseDuration(song.duration) }}
                </button>
                <div class="flex gap-1 sm:gap-2">
                    <button class="btn !px-3 !py-2 h-fit" @click="toggleMute">
                        <i :class="isMuted ? 'fas fa-volume-xmark' : 'fas fa-volume'"></i>
                    </button>
                    <button class="btn !px-3 !py-2 h-fit" @click="$emit('prev-song')">
                        <i class="fad fa-backward"></i>
                    </button>
                    <button class="btn !px-3 !py-2 h-fit" @click="togglePlayPause">
                        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
                    </button>
                    <button class="btn !px-3 !py-2 h-fit" @click="stopVideo">
                        <i class="fas fa-stop"></i>
                    </button>
                    <button class="btn !px-3 !py-2 h-fit" @click="$emit('skip-song')">
                        <i class="fad fa-forward"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { parseDuration } from '@helpers/durationHelper';
import dayjs from 'dayjs';

export default {
    props: {
        autoplay: {
            type: String,
            required: true,
        },
        song: {
            type: Object,
            required: true,
        },
        BreakSchedule: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isPlaying: false,
            isMuted: false,
            player: null,
            nextAdzan: '',
            adzanTimes: [],
        };
    },
    computed: {
        videoUrlWithParams() {
            let url = this.autoplay == false ?
                `${this.song.url}?enablejsapi=1&rel=0&showinfo=0&iv_load_policy=3`
                : `${this.song.url}?autoplay=1&enablejsapi=1&rel=0&showinfo=0&iv_load_policy=3`;
            return url
        },
    },
    mounted() {
        this.loadYouTubeIframeAPI();
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        this.checkAdzanTime();
        setInterval(this.checkAdzanTime, 60000); // Check every minute
    },
    beforeDestroy() {
        this.cleanup();
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

                if (event.data === window.YT.PlayerState.PLAYING) {
                    this.isPlaying = true;
                } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                    this.isPlaying = false;
                }
            }
        },
        togglePlayPause() {
            if (this.isPlaying) {
                this.pauseVideo();
            } else {
                this.playVideo();
            }
        },
        toggleMute() {
            if (this.isMuted) {
                this.isMuted = false
                this.player.unMute();
            } else {
                this.isMuted = true
                this.player.mute();
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
        handleBeforeUnload(event) {
            this.stopVideoAndUpdateStatus();
        },
        stopVideoAndUpdateStatus() {
            this.stopVideo();
            this.$emit('video-state', -1);
        },
        cleanup() {
            this.stopVideoAndUpdateStatus();
            window.removeEventListener('beforeunload', this.handleBeforeUnload);
        },
        async checkAdzanTime() {
            const hour = dayjs().hour();
            const minute = dayjs().minute();
            const now = `${hour}:${minute}`;

            for (let time of this.BreakSchedule) {
                if (now === time.time) {
                    this.$emit('video-state', -1);
                    time.key === 'break' ? this.$emit('play-break') : time.key === 'home' ? this.$emit('play-sayonara') : this.$emit('play-adzan');
                    break;
                }
            }
        }

    },
};
</script>
