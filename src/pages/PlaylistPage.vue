<template>
    <Container>
        <div>
            <SongInput :playlist="playlist" :userQueue="userQueue" />

            <div class=" mt-8">
                <div class="flex mb-4">
                    <input ref="urlInput" v-model="query" @input="onInput" type="url"
                        placeholder="Type your favourite song or artist" class="form-input flex-1 !rounded-r-none"
                        required />
                    <button type="button" @click="search"
                        class="w-10 bg-container py-2 px-3 rounded-r-md border !border-neutral-300 dark:!border-stroke flex items-center hover:text-primary base-transition">
                        <i class="fad fa-music-magnifying-glass"></i>
                    </button>
                </div>
                <Alert :message="error" :icon="'circle-info'" />
                <p v-if="originPlaylist && originPlaylist.length === 0"
                    class="text-base text-subtext flex gap-2 items-center">
                    <i class="fas fa-music-slash"></i> Your playlist is currently empty. Let's add some tunes!
                </p>
                <p v-else-if="playlist && playlist.length === 0 && query"
                    class="text-base text-subtext flex gap-2 items-center">
                    <i class="fas fa-music-slash"></i> Sorry, we couldn't find any song that matches your search '{{ query
                    }}'.
                </p>
                <div v-else class="flex flex-col gap-2 mt-4">
                    <SongList :user="user" :userQueue="userQueue" @add-to-queue="handleAddToQueue" :playlist="playlist"
                        :isCooldown="isCooldown" :cooldownTime="cooldownTime" @delete-song="deleteSong"
                        :disableBtn="disableAddButton" />
                </div>
            </div>
        </div>
    </Container>
</template>

<script>
import SongList from '@components/views/playlist/SongList.vue'
import SongInput from '@components/views/playlist/SongInput.vue'
import Container from '@components/layout/Container.vue'
import Alert from '@components/partial/Alert.vue';
import { supabase } from '@services/supabase'
import { useUserStore } from '@stores/user';
import { useTitle } from '@vueuse/core'
import { debounce } from 'lodash';
import dayjs from 'dayjs'

export default {
    components: {
        SongInput,
        Container,
        SongList,
        Alert
    },
    data() {
        return {
            playlist: [],
            originPlaylist: [],
            user: null,
            error: null,
            isCooldown: false,
            userQueue: [],
            cooldownTime: 0,
            duration: 0,
            cooldownInterval: null,
            query: '',
            currentTime: dayjs().format('HH:mm'),
        }
    },
    computed: {
        disableAddButton() {
            if (this.currentTime <= '08:20') {
                this.error = 'Requests will be available starting at 08:20 AM. Please check back then.'
                return true
            } else if (this.userQueue.length >= 4) {
                this.error = 'You have reached the maximum number of requests. Please wait for your songs to be played before adding more.'
                return true
            } else {
                this.error = ''
            }
        }
    },
    methods: {
        onInput: debounce(function () {
            this.search();
        }, 300),
        search() {
            if (!this.query) {
                this.playlist = this.originPlaylist;
                return;
            }
            this.playlist = this.originPlaylist.filter(song =>
                song.title.toLowerCase().includes(this.query.toLowerCase()) || song.artist.toLowerCase().includes(this.query.toLowerCase())
            );
        },
        async fetchPlaylist() {
            let { data: songs, error } = await supabase
                .from('playlist')
                .select('*')
                .eq('created_by', this.user.id)
                .order('created_at', { ascending: true })
            if (!error) this.playlist = songs
            if (!error) this.originPlaylist = songs
        },
        async addToQueue(song) {
            this.error = ''
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
        setupRealtime() {
            supabase
                .channel('realtime-playlist')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'playlist' }, payload => {
                    console.log('Change received!', payload)
                    this.fetchPlaylist()
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, payload => {
                    console.log('a');
                    this.fetchUserQueue()
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
                if (this.currentTime <= '08:20') {
                    this.error = 'Requests will be available starting at 08:20 AM. Please check back then.'
                    return
                } else if (this.userQueue.length >= 4) {
                    this.error = 'You have reached the maximum number of requests. Please wait for your songs to be played before adding more.'
                    return
                }
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
        },
        async fetchUserQueue() {
            let { data: songs, error } = await supabase
                .from('songs')
                .select('*')
                .neq('status', 0)
                .eq('created_by', this.user.id)
                .order('created_at', { ascending: true })
            if (!error) this.userQueue = songs
        },
        updateTime() {
            this.currentTime = dayjs().format('HH:mm');
        },
    },
    async mounted() {
        await this.userStore();
        await this.fetchUserQueue()
        this.fetchPlaylist();
        this.setupRealtime();
        this.checkCooldown(); // Periksa cooldown saat komponen dipasang
        this.updateTime();
        setInterval(this.updateTime, 60000);
        useTitle('Playlist - Lazyplay')
    },
}
</script>
