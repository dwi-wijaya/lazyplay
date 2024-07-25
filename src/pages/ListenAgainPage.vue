<template>
    <Container>
        <h1 class="font-bold text-2xl">Listen Again</h1>
        <div class="mt-8  flex flex-col gap-4">
            <Alert :message="message" :icon="'circle-info'" />
            <Alert :message="error" :icon="'triangle-exclamation'" :type="'danger'" :closable="true" />
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <div class="group relative flex flex-col h-full w-full aspect-square " v-for="(video, index) in userHistory"
                    :key="index">
                    <div class="duration-500 relative h-full rounded-xl overflow-hidden">
                        <img :src="video.thumbnail" :alt="video.title"
                            class="object-cover w-full h-full transform transition-transform duration-300 scale-[1.35] group-hover:scale-[1.5] group-hover:blur-sm" />
                        <div
                            class="absolute z-10 top-0 left-0 flex flex-col gap-2 justify-center items-center w-full h-[calc(100%-3.75rem)]">
                            <button @click="AddToQueue(video)" :disabled="isCooldown || disableRequest"
                                class="!w-36 justify-center btn z-10 opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed">
                                <i class="fad fa-signal-stream"></i>
                                {{ isCooldown ? `(${cooldownTime}s)` : 'Request' }}
                            </button>
                            <button @click="copyToClipboard(video.url, index)" :disabled="isCooldown"
                                class="!w-36 justify-center btn z-10 opacity-0 group-hover:opacity-100">
                                <i :class="state.clipboardIcon[index] ?? 'fad fa-clipboard'"></i>
                                {{ state.clipboardText[index] ?? 'Copy' }}
                            </button>
                            <div
                                class="absolute top-0 left-0 bg-black opacity-0 group-hover:opacity-50 base-transition w-full h-full">
                            </div>
                        </div>
                        <div
                            class="absolute inset-0 bg-gradient-to-b from-black/0 to-black opacity-90 transition-opacity duration-300">
                        </div>
                    </div>
                    <div class="absolute px-4 py-3 space-y-4 w-full bottom-0 h-15 backdrop-blur-sm rounded-b-2xl">
                        <div class="flex gap-2">
                            <img :src="video.artist_image" class="w-8 h-8 rounded-md" alt="" srcset="">
                            <div class="flex flex-col">
                                <h3 class="line-clamp-1 leading-5 font-medium text-neutral-200">{{ video.title }}</h3>
                                <p class="text-xs line-clamp-1 m-0 text-neutral-400">{{ video.artist }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Container>
</template>

<script>
import axios from 'axios';
import Container from '@components/layout/Container.vue';
import SearchBar from '@components/views/browse/SearchBar.vue';
import VideoGrid from '@components/views/browse/VideoGrid.vue';
import History from '@components/views/browse/History.vue';
import { supabase } from '@services/supabase';
import { useUserStore } from '@stores/user';
import { useTitle } from '@vueuse/core';
import dayjs from 'dayjs';
import Alert from '@components/partial/Alert.vue';
import { REQUEST_AVAILABLE_TIME, MAX_REQUESTS_REACHED } from '@constants/messages.js';
import { useClipboard } from "@vueuse/core";

export default {
    components: {
        SearchBar,
        Container,
        VideoGrid,
        History,
        Alert
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
            userHistory: [],
            state: {
                clipboardText: [],
                clipboardIcon: []
            },
            isLoading: false,
            message: '',
            currentTime: dayjs().format('HH:mm'),
        }
    },
    computed: {
        disableRequest() {
            if (this.currentTime <= '08:20') {
                this.message = REQUEST_AVAILABLE_TIME;
                return true;
            } else if (this.userQueue.length >= 4) {
                this.message = MAX_REQUESTS_REACHED;
                return true;
            } else {
                this.message = '';
            }
        }
    },
    async mounted() {
        await this.userStore();
        await this.fetchUserQueue();
        await this.fetchHistory();
        this.setupRealtime();
        this.checkCooldown();
        this.updateTime();
        setInterval(this.updateTime, 60000); // Update setiap menit
        useTitle('Listen Again - Lazyplay');
    },
    watch: {
        userHistory(newHistory) {
            this.state.clipboardText = newHistory.map(() => 'Copy');
            this.state.clipboardIcon = newHistory.map(() => 'fad fa-clipboard');
        }
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
                    this.fetchUserQueue();
                    this.fetchHistory();
                })
                .subscribe();
        },
        async userStore() {
            const userStore = useUserStore();
            await userStore.fetchUser();
            this.user = userStore.user;
        },
        async addToQueue(data) {
            if (this.currentTime <= '08:20') {
                return;
            } else if (this.userQueue.length >= 4) {
                return;
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
        async fetchUserQueue() {
            let { data: songs, error } = await supabase
                .from('songs')
                .select('*')
                .neq('status', 0)
                .eq('created_by', this.user.id)
                .order('created_at', { ascending: true });
            if (!error) this.userQueue = songs;
        },
        async fetchHistory() {
            let { data: songs, error } = await supabase
                .from('songs')
                .select('*')
                .eq('status', 0)
                .eq('created_by', this.user.id)
                .order('created_at', { ascending: false })
                .limit(20);
            if (!error) this.userHistory = songs;
        },
        async AddToQueue(song) {
            if (!this.isCooldown) {
                const data = {
                    url: song.url,
                    title: song.title,
                    duration: song.duration,
                    thumbnail: song.thumbnail,
                    channelTitle: song.artist,
                    channelImage: song.artist_image
                };

                this.addToQueue(data);
            }
        },
        async copyToClipboard(videoId, index) {
            const { copy, copied } = useClipboard({ source: `https://youtube.com/embed/${videoId}` });
            copy();
            if (copied) {
                this.state.clipboardText[index] = 'Copied!';
                this.state.clipboardIcon[index] = 'fad fa-check';
                setTimeout(() => {
                    this.state.clipboardText[index] = 'Copy';
                    this.state.clipboardIcon[index] = 'fad fa-clipboard';
                }, 2000);
            }
        }
    }
}
</script>

<style scoped></style>
