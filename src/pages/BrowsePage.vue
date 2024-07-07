<template>
    <Container>
        <SearchBar @search="debouncedSearch" :isLoading="isLoading" />
        <div class="mt-6">
            <p class="text-text text-lg flex gap-2 items-center" v-if="videos === 'notfound'">
                <i class="text-primary fad fa-exclamation-circle"></i> Sorry, we couldn't find any song matching your search.
            </p>
            <VideoGrid v-else :videos="videos" @add-to-queue="handleAddToQueue" :isCooldown="isCooldown"
                :cooldownTime="cooldownTime" />
        </div>
    </Container>
</template>
  
<script>
import axios from 'axios';
import _ from 'lodash';
import Container from '@components/layout/Container.vue';
import SearchBar from '@components/views/browse/SearchBar.vue';
import VideoGrid from '@components/views/browse/VideoGrid.vue';
import { supabase } from '@services/supabase'
import { useUserStore } from '@stores/user';

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
            isLoading: false
        };
    },
    async mounted() {
        await this.userStore();
        this.checkCooldown();
    },
    methods: {
        async userStore() {
            const userStore = useUserStore();
            await userStore.fetchUser();
            this.user = userStore.user;
        },
        async addToQueue(data) {
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
            const { error } = await supabase
                .from('songs')
                .insert([song]);

            if (!error) {
                this.error = '';
            } else {
                this.error = 'Gagal menambahkan lagu.';
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
            this.cooldownTime = 20; // 20 detik cooldown
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
            if (!query) {
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
                        videoCategoryId: '10', // Kategori Musik
                        maxResults: 20,
                        key: import.meta.env.VITE_GOOGLE_API_KEY // Ganti dengan API Key Anda
                    }
                });

                const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

                const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        part: 'snippet,contentDetails',
                        id: videoIds,
                        key: import.meta.env.VITE_GOOGLE_API_KEY // Ganti dengan API Key Anda
                    }
                });

                this.videos = videosResponse.data.items.length === 0 ? 'notfound' : videosResponse.data.items;
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                this.isLoading = false;
            }
        },
        debouncedSearch: _.debounce(function (query) {
            this.searchVideos(query);
        }, 300)
    }
};
</script>
  
<style>
/* Add any global styles here */
</style>
  