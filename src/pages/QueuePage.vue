<template>
    <Container>
        <div class="flex flex-col gap-4">
            <SongInput @song-added="fetchSongs" @handle-error="handleError" :queue="songs" :user="user" :message="message" :disableRequest="disableRequest" />
            <div class="mt-4 flex flex-col gap-4">
                <Alert :message="message" :icon="'circle-info'" />
                <Alert :message="error" :icon="'triangle-exclamation'" :type="'danger'" :closable="true" />
                <div v-if="songs.length == 0" class="text-subtext flex items-center gap-2"><i
                        class="fad fa-list-music"></i>The Queue are currently empty, add some songs!</div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <SongCard :user="user" :songs="songs" @delete-song="deleteSong" />
                </div>
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
import Alert from '@components/partial/Alert.vue';
import { REQUEST_AVAILABLE_TIME, MAX_REQUESTS_REACHED } from '@constants/messages.js';
import dayjs from 'dayjs'

export default {
    components: {
        SongInput,
        Container,
        SongCard,
        Alert
    },
    data() {
        return {
            currentTime: dayjs().format('HH:mm'),
            message: '',
            error: '',
            user: null,
            songs: [],
        }
    },
    computed: {
        disableRequest() {
            const userQueueCount = this.songs.filter(song => song.created_by === this.user.id).length;

            if (this.currentTime <= '08:20') {
                this.message = (this.user?.user_metadata?.is_pro ?? false)  ? REQUEST_AVAILABLE_TIME.replace('or upgrade to <strong>PRO</strong>', '') : REQUEST_AVAILABLE_TIME
                return true
            } else if (userQueueCount >= 4) {
                this.message = (this.user?.user_metadata?.is_pro ?? false)  ? MAX_REQUESTS_REACHED.replace('or upgrade to <strong>PRO</strong>', '') : MAX_REQUESTS_REACHED
                return true
            } else {
                this.message = ''
            }
        }
    },
    methods: {
        async handleError(error) {
            this.error = error
        },
        async fetchSongs() {
            let { data: songs, error } = await supabase
                .from('requests')
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
        updateTime() {
            this.currentTime = dayjs().format('HH:mm');
        },
    },
    async mounted() {
        await this.userStore();
        this.fetchSongs()
        this.setupRealtime()
        this.updateTime();
        setInterval(this.updateTime, 60000);
        useTitle('Queue - Lazyplay')
    },
}
</script>

<style scoped>
.container {
    @apply max-w-4xl mx-auto p-4;
}
</style>
