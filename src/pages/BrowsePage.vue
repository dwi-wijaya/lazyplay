<template>
    <Container>
        <SearchBar @search="searchVideos" :isLoading="isLoading" />
        <div class="mt-6">
            <p class="text-text flex items-center gap-2 card !rounded-lg mt-4" v-if="error">
                <i class="fa-duotone fa-circle-exclamation"></i>
                {{ error }}
            </p>
            <p class="text-text flex items-center gap-2" v-else-if="videos === 'notfound'">
                <i class="fa-duotone fa-magnifying-glass-minus"></i>Sorry, no videos found. Try searching for something
                else.
            </p>
            <VideoGrid v-else :videos="videos" @add-to-queue="handleAddToQueue" :isCooldown="isCooldown"
                :isDisable="disableAddButton" :cooldownTime="cooldownTime" :userQueue="userQueue" />
        </div>
    </Container>
</template>

<script>
import axios from 'axios';
import Container from '@components/layout/Container.vue';
import SearchBar from '@components/views/browse/SearchBar.vue';
import VideoGrid from '@components/views/browse/VideoGrid.vue';
import { supabase } from '@services/supabase';
import { useUserStore } from '@stores/user';
import { useTitle } from '@vueuse/core'
import dayjs from 'dayjs';

export default {
    components: {
        SearchBar,
        VideoGrid
    },
    data() {
        return {
            user: null,
            videos: [],
            isCooldown: false,
            cooldownTime: 0,
            cooldownInterval: null,
            error: '',
            userQueue: [],
            isLoading: false,
            currentTime: dayjs().format('HH:mm'),
        }
    },
    computed: {
        disableAddButton() {
            if (this.currentTime <= '08:20') {
                console.log('time');
                this.error = 'Requests will be available starting at 08:20 AM. Please check back then.'
                return true
            } else if (this.userQueue.length >= 4) {
                console.log('que');
                this.error = 'You have reached the maximum number of requests. Please wait for your songs to be played before adding more.'
                return true
            } else {
                console.log('reset');
                this.error = ''
            }
        }
    },
    async mounted() {
        await this.userStore();
        await this.fetchUserQueue();
        this.setupRealtime();
        this.checkCooldown();
        this.updateTime();
        setInterval(this.updateTime, 60000); // Update setiap menit
        useTitle('Browse - Lazyplay')
    },
    methods: {
        updateTime() {
            this.currentTime = dayjs().format('HH:mm');
        },
        setupRealtime() {
            supabase
                .channel('realtime-songs')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, payload => {
                    console.log('realtime');
                    this.fetchUserQueue()
                })
                .subscribe()
        },
        async userStore() {
            const userStore = useUserStore();
            await userStore.fetchUser();
            this.user = userStore.user;
        },
        async addToQueue(data) {
            if (this.currentTime <= '08:20') {
                this.error = 'Requests will be available starting at 08:20 AM. Please check back then.'
                return
            } else if (this.userQueue.length >= 4) {
                this.error = 'You have reached the maximum number of requests. Please wait for your songs to be played before adding more.'
                return
            }
            const song = {
                url: data.url,
                title: data.title,
                duration: data.duration,
                thumbnail: data.thumbnail,
                artist: data.channelTitle,
                artist_image: data.channelImage,
                created_at: new Date(),
                created_by: this.user.id,
                created_name: this.user.user_metadata.full_name
            };
            const { error } = await supabase.from('songs').insert([song]);

            if (!error) {
                this.error = '';
            } else {
                this.error = 'Failed to add the song.';
            }
        },
        handleAddToQueue(data) {
            if (!this.isCooldown) {
                this.addToQueue(data);
                this.startCooldown();
            }
        },
        startCooldown() {
            this.isCooldown = true;
            this.cooldownTime = 20; // 20 seconds cooldown
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
            const cooldownTime = parseInt(localStorage.getItem('cooldownTime'));
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
        async searchVideos(query) {
            if (!query && this.error) {
                this.videos = [];
                return;
            }
            this.isLoading = true;
            try {
                const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: query,
                        type: 'video',
                        videoCategoryId: '10', // Music Category
                        maxResults: 20,
                        key: import.meta.env.VITE_GOOGLE_API_KEY // Replace with your API Key
                    }
                });

                const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

                const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        part: 'snippet,contentDetails',
                        id: videoIds,
                        key: import.meta.env.VITE_GOOGLE_API_KEY // Replace with your API Key
                    }
                });

                this.videos = videosResponse.data.items.length === 0 ? 'notfound' : videosResponse.data.items;
                this.error = '';
            } catch (error) {
                if (error.response && error.response.data.error.message.includes('quota')) {
                    this.error = 'The request cannot be completed because you have exceeded your quota. Please try again later.';
                } else {
                    console.error('Error fetching videos:', error);
                }
            } finally {
                this.isLoading = false;
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

    }
};
</script>
