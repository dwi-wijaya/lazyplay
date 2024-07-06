<template>
    <Container>
        <div>
            <SongInput @song-added="fetchSongs" />
            <div class="flex flex-col gap-2">
                <SongList 
                    @add-to-queue="handleAddToQueue" 
                    :playlist="playlist" 
                    :isCooldown="isCooldown" 
                    :cooldownTime="cooldownTime" 
                    @delete-song="deleteSong" 
                />
            </div>
        </div>
    </Container>
</template>

<script>
import SongList from '@components/views/playlist/SongList.vue'
import SongInput from '@components/views/playlist/SongInput.vue'
import Container from '@components/layout/Container.vue'
import { supabase } from '@services/supabase'
import { useUserStore } from '@stores/user';

export default {
    components: {
        SongInput,
        Container,
        SongList
    },
    data() {
        return {
            playlist: [],
            user: null,
            error: null,
            isCooldown: false,
            cooldownTime: 0,
            cooldownInterval: null
        }
    },
    methods: {
        async fetchSongs() {
            let { data: songs, error } = await supabase
                .from('playlist')
                .select('*')
                .eq('created_by', this.user.id)
                .order('created_at', { ascending: true })
            if (!error) this.playlist = songs
        },
        async addToQueue(song) {
            const { error } = await supabase
                .from('songs')
                .insert([
                    {
                        url: song.url,
                        title: song.title,
                        duration: song.duration,
                        thumbnail: song.thumbnail,
                        created_at: new Date(),
                        artist: song.artist,
                        artist_image: song.artist_image,
                        created_by: this.user.id,
                        created_name: this.user.user_metadata.full_name
                    }
                ])

            if (!error) {
                this.error = ''
            } else {
                this.error = 'Failed to add the song.'
            }
        },
        async deleteSong(id) {
            const { error } = await supabase
                .from('playlist')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('Error deleting song:', error);
            }
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
            console.log(userStore.user);
        },
        handleAddToQueue(song) {
            if (!this.isCooldown) {
                this.addToQueue(song);
                this.startCooldown();
            }
        },
        startCooldown() {
            this.isCooldown = true;
            this.cooldownTime = 10;
            this.cooldownInterval = setInterval(() => {
                this.cooldownTime--;
                if (this.cooldownTime <= 0) {
                    clearInterval(this.cooldownInterval);
                    this.isCooldown = false;
                }
            }, 1000);
        }
    },
    async mounted() {
        await this.userStore()
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
