<template>
    <div>
        <iframe class="rounded-xl w-full h-[30rem]" ref="player"  :src="videoUrlWithParams"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameborder="0">
        </iframe>
        <div class="flex gap-2 my-4">
            <button class="btn" @click="$emit('prev-song')"><i class="fad fa-backward"></i></button>
            <button class="btn" @click="playVideo"><i class="fad fa-play"></i></button>
            <button class="btn" @click="pauseVideo"><i class="fad fa-pause"></i></button>
            <button class="btn" @click="stopVideo"><i class="fad fa-stop"></i></button>
            <button class="btn" @click="$emit('skip-song')"><i class="fad fa-forward"></i></button>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        videoUrl: {
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
            return `${this.videoUrl}?autoplay=1&enablejsapi=1`;
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