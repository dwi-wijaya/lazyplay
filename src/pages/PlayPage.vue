<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Playing...</h1>
        <div v-if="currentSong">
            <VideoPlayer :video-url="currentSong.url" @video-ended="handleVideoEnd" />
        </div>
    </div>
</template>
  
<script>
import VideoPlayer from '../components/VideoPlayer.vue'
import { supabase } from '../supabase'

export default {
    components: {
        VideoPlayer,
    },
    data() {
        return {
            currentSong: null,
        }
    },
    methods: {
        async fetchNextSong() {
            let { data: songs, error } = await supabase
                .from('songs')
                .select('*')
                .eq('stat', 0)
                .order('created_at', { ascending: true })
                .limit(1)
            if (!error && songs.length > 0) this.currentSong = songs[0]
        },
        async handleVideoEnd() {
            if (this.currentSong) {
                await supabase
                    .from('songs')
                    .update({ stat: 1 })
                    .eq('id', this.currentSong.id)
                this.currentSong = null
                this.fetchNextSong()
            }
        },
    },
    mounted() {
        this.fetchNextSong()
    },
}
</script>
  
<style scoped>
.container {
    @apply max-w-4xl mx-auto p-4;
}
</style>
  