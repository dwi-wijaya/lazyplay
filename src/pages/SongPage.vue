<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Song List</h1>
        <SongInput @song-added="fetchSongs" />
        <SongList :songs="songs" />
    </div>
</template>
  
<script>
import SongInput from '../components/SongInput.vue'
import SongList from '../components/SongList.vue'
import { supabase } from '../supabase'

export default {
    components: {
        SongInput,
        SongList,
    },
    data() {
        return {
            songs: [],
        }
    },
    methods: {
        async fetchSongs() {
            let { data: songs, error } = await supabase
                .from('songs')
                .select('*')
                .eq('stat', 0)
                .order('created_at', { ascending: true })
            if (!error) this.songs = songs
        },
    },
    mounted() {
        this.fetchSongs()
    },
}
</script>
  
<style scoped>
.container {
    @apply max-w-4xl mx-auto p-4;
}
</style>
  