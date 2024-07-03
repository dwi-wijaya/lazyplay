<template>
    <Container>
        <div class="">
            <SongInput @song-added="fetchSongs" />
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <SongCard :songs="songs" @delete-song="deleteSong" />
            </div>
        </div>
    </Container>
</template>

<script>
import SongCard from '@components/views/queue/SongCard.vue'
import SongInput from '@components/views/queue/SongInput.vue'
import Container from '@components/layout/Container.vue'
import { supabase } from '@services/supabase'

export default {
    components: {
    SongInput,
    Container,
    SongCard
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
                .neq('status', 0)
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