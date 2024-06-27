<template>
    <div>
        <iframe id="player" type="text/html" width="640" height="390" :src="videoUrlWithParams"
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
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(script)

        window.onYouTubeIframeAPIReady = () => {
            this.player = new YT.Player('player', {
                events: {
                    onReady: this.onPlayerReady,
                    onStateChange: this.onPlayerStateChange,
                },
            })
        }
    },
    methods: {
        onPlayerReady(event) {
            console.log('Player ready')
        },
        onPlayerStateChange(event) {
            if (event.data === 0) {
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
  