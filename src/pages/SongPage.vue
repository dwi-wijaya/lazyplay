<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Song Queue</h1>
        <SongInput @song-added="fetchSongs" />
        <SongList :songs="songs" @delete-song="deleteSong" />
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
        async deleteSong(play_id) {
            const { error } = await supabase
                .from('songs')
                .delete()
                .eq('id', play_id)
            if (error) {
                console.error('Error deleting song:', error)
            }
        },
        setupRealtime() {
            supabase
                .channel('realtime-songs')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, payload => {
                    console.log('Change received!', payload)
                    this.fetchSongs()
                })
                .subscribe()
        }
    },
    mounted() {
        this.fetchSongs()
        this.setupRealtime()
    },
}
</script>

<style scoped>
.container {
    @apply max-w-4xl mx-auto p-4;
}
</style>
g