<template>
    <Container>
        <div class="">
            <SongInput @song-added="fetchSongs" :queue="songs" :user="user" />
            <div v-if="songs.length == 0" class="text-subtext flex items-center gap-2"><i class="fad fa-list-music"></i>The Queue are currently empty, add some songs!</div>
            <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <SongCard :user="user" :songs="songs" @delete-song="deleteSong" />
            </div>
        </div>
    </Container>
</template>

<script>
import SongCard from '@components/views/queue/SongCard.vue'
import SongInput from '@components/views/queue/SongInput.vue'
import Container from '@components/layout/Container.vue'
import { supabase } from '@services/supabase'
import { useTitle } from '@vueuse/core'
import { useUserStore } from '@stores/user';

export default {
    components: {
        SongInput,
        Container,
        SongCard
    },
    data() {
        return {
            user: null,
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
        },
        async userStore() {
            const userStore = useUserStore();
            await userStore.fetchUser();
            this.user = userStore.user
        },
    },
    async mounted() {
        await this.userStore();
        this.fetchSongs()
        this.setupRealtime()
        useTitle('Queue - Lazyplay')
    },
}
</script>

<style scoped>
.container {
    @apply max-w-4xl mx-auto p-4;
}
</style>
