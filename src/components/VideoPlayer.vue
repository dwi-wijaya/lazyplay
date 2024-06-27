<template>
    <div>
        <iframe ref="player" width="640" height="390" :src="videoUrlWithParams"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameborder="0"></iframe>
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
    computed: {
        videoUrlWithParams() {
            return `${this.videoUrl}?autoplay=1&enablejsapi=1`
        },
    },
    mounted() {
        this.loadYouTubeIframeAPI()
    },
    watch: {
        videoUrl() {
            this.reloadYouTubePlayer()
        }
    },
    methods: {
        loadYouTubeIframeAPI() {
            if (!window.YT) {
                const tag = document.createElement('script')
                tag.src = 'https://www.youtube.com/iframe_api'
                const firstScriptTag = document.getElementsByTagName('script')[0]
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

                window.onYouTubeIframeAPIReady = () => {
                    this.initYouTubePlayer()
                }
            } else {
                this.initYouTubePlayer()
            }
        },
        initYouTubePlayer() {
            this.player = new window.YT.Player(this.$refs.player, {
                events: {
                    onReady: this.onPlayerReady,
                    onStateChange: this.onPlayerStateChange,
                },
            })
        },
        reloadYouTubePlayer() {
            if (this.player) {
                this.player.destroy()
            }
            this.initYouTubePlayer()
        },
        onPlayerReady(event) {
            console.log('Player ready')
        },
        onPlayerStateChange(event) {
            if (event.data === window.YT.PlayerState.ENDED) {
                console.log('Video ended');
                this.$emit('video-ended')
            }
        },
    },
}
</script>
  
<style scoped>
div {
    @apply flex justify-center;
}

iframe {
    @apply w-full max-w-xl;
}
</style>
