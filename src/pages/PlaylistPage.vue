<template>
    <Container>
        <div>
            <SongInput :playlist="playlist" />
            <div class=" mt-8">

                <p v-if="playlist && playlist.length === 0" class="text-base text-subtext flex gap-2 items-center"><i class="fas fa-music-slash"></i> Your playlist is currently empty. Let's add some tunes!</p>
                <div v-else class="flex flex-col gap-2">
                    <SongList @add-to-queue="handleAddToQueue" :playlist="playlist" :isCooldown="isCooldown"
                    :cooldownTime="cooldownTime" @delete-song="deleteSong" />
                </div>
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
import { useTitle } from '@vueuse/core'

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
            duration: 0,
            cooldownInterval: null
        }
    },
    methods: {
        async fetchPlaylist() {
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
        async deleteSong(id) {
            const { error } = await supabase
                .from('playlist')
                .delete()
                .eq('id', id)
            if (error) {
                console.error('Error deleting song:', error)
            }
        },
        setupRealtime() {
            supabase
                .channel('realtime-playlist')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'playlist' }, payload => {
                    console.log('Change received!', payload)
                    this.fetchPlaylist()
                })
                .subscribe()
        },
        async userStore() {
            const userStore = useUserStore();
            await userStore.fetchUser();
            this.user = userStore.user
        },
        handleAddToQueue(song) {
            if (!this.isCooldown) {
                this.addToQueue(song);
                this.startCooldown();
            }
        },
        startCooldown() {
            this.isCooldown = true;
            this.cooldownTime = 20;
            localStorage.setItem('isCooldown', true);
            localStorage.setItem('cooldownTime', this.cooldownTime);
            this.cooldownInterval = setInterval(() => {
                this.cooldownTime--;
                localStorage.setItem('cooldownTime', this.cooldownTime);
                if (this.cooldownTime <= 0) {
                    clearInterval(this.cooldownInterval);
                    this.isCooldown = false;
                    localStorage.removeItem('isCooldown');
                    localStorage.removeItem('cooldownTime');
                }
            }, 1000);
        },
        checkCooldown() {
            const isCooldown = localStorage.getItem('isCooldown');
            const cooldownTime = localStorage.getItem('cooldownTime');
            if (isCooldown && cooldownTime > 0) {
                this.isCooldown = true;
                this.cooldownTime = cooldownTime;
                this.cooldownInterval = setInterval(() => {
                    this.cooldownTime--;
                    localStorage.setItem('cooldownTime', this.cooldownTime);
                    if (this.cooldownTime <= 0) {
                        clearInterval(this.cooldownInterval);
                        this.isCooldown = false;
                        localStorage.removeItem('isCooldown');
                        localStorage.removeItem('cooldownTime');
                    }
                }, 1000);
            }
        }
    },
    async mounted() {
        await this.userStore();
        this.fetchPlaylist();
        this.setupRealtime();
        this.checkCooldown(); // Periksa cooldown saat komponen dipasang
        useTitle('Playlist - Lazyplay')
    },
}
</script>

