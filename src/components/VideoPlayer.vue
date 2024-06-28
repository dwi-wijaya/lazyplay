<template>
    <div>
        <iframe ref="player" width="640" height="390" :src="videoUrlWithParams"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameborder="0">
        </iframe>
        <div class="controls">
            <button @click="playVideo">Play</button>
            <button @click="pauseVideo">Pause</button>
            <button @click="stopVideo">Stop</button>
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
  
<style scoped>
div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.controls {
    display: flex;
    justify-content: center;
}
</style>