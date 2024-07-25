<template>
    <div class="mb-4">
        <form @submit.prevent="toggleInput" :class="['flex justify-between gap-4', { 'flex-col': showInput }]">
            <div class="flex justify-between flex-1">
                <h1 class="text-2xl font-bold">Song Queue ({{ queue.length }})</h1>
                <div class="flex gap-1 justify-end">
                    <button v-if="showInput" @click="showInput = false" type="button" class="btn !py-2 !px-2">
                        <i class="fas fa-xmark"></i>
                    </button>
                    <div class="relative group">
                        <button type="submit" class="btn !py-2 !px-3 disabled:cursor-not-allowed"
                            :disabled="disableAddButton">
                            <i class="fad fa-music"></i>Add Songs
                        </button>
                        <!-- <span v-if="disableAddButton"
                            class="absolute right-0 border w-72 border-stroke top-10 mb-2 hidden group-hover:block bg-container text-sm rounded py-1 px-2 z-20">
                            {{ this.disableMsg }}
                        </span> -->
                    </div>
                </div>
            </div>
            <div v-if="showInput" class="grid col-2 gap-2">
                <div class="flex">
                    <input ref="urlInput" v-model="url" type="url" placeholder="YouTube or Youtube Music URL"
                        class="form-input flex-1 !rounded-r-none" required />
                    <button type="button"
                        class="w-10 bg-container py-2 px-3 rounded-r-md border border-stroke flex items-center hover:text-primary base-transition"
                        @click="handleButtonClick">
                        <i :class="buttonIcon"></i>
                    </button>
                </div>
                <div class="flex">
                    <input v-model="note" type="text" placeholder="Note" class="form-input flex-1 !rounded-r-none" />
                    <div class="w-10 bg-container py-2 px-3 rounded-r-md border border-stroke flex items-center">
                        <i class="fad fa-note"></i>
                    </div>
                </div>
            </div>
        </form>
        <Alert :message="error" :icon="'circle-info'" />
    </div>
</template>

<script>
import { supabase } from '@services/supabase'
import { getVideoDetails, extractVideoID } from '@services/youtube'
import { parseISO8601Duration } from '@helpers/durationHelper'
import dayjs from 'dayjs';
import Alert from '@components/partial/Alert.vue';
import { REQUEST_AVAILABLE_TIME, MAX_REQUESTS_REACHED } from '@constants/messages.js';

export default {
    props: {
        queue: {
            type: Array,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
    },
    components: {
        Alert
    },
    data() {
        return {
            url: '',
            note: '',
            error: '',
            showInput: false,
            currentTime: dayjs().format('HH:mm'),
        }
    },
    mounted() {
        this.updateTime();
        setInterval(this.updateTime, 60000); // Update setiap menit
    },

    computed: {
        buttonIcon() {
            return this.url != '' ? 'fad fa-trash' : 'fad fa-paste';
        },
        disableAddButton() {
            const userQueueCount = this.queue.filter(song => song.created_by === this.user.id).length;

            if (this.currentTime <= '08:20') {
                this.error = REQUEST_AVAILABLE_TIME
                return true
            } else if (userQueueCount >= 4) {
                this.error = MAX_REQUESTS_REACHED
                return true
            } else {
                this.error = ''
            }
        }
    },
    methods: {
        getVideoDetails,
        extractVideoID,
        parseISO8601Duration,
        updateTime() {
            this.currentTime = dayjs().format('HH:mm');
        },
        handleButtonClick() {
            if (this.url !== '') {
                this.clearUrl();
            } else {
                this.pasteFromClipboard();
            }
        },
        async pasteFromClipboard() {
            try {
                const text = await navigator.clipboard.readText();
                this.url = text;
            } catch (error) {
                console.error('Failed to paste from clipboard:', error);
            }
        },
        clearUrl() {
            this.url = '';
        },
        async toggleInput() {
            if (this.showInput) {
                await this.addSong()
            } else {
                this.showInput = true
                this.$nextTick(() => {
                    if (this.showInput) {
                        this.$refs.urlInput.focus();
                    }
                });
            }
        },
        async addSong() {
            this.error = ''

            if (this.currentTime <= '08:20') {
                this.error = 'Requests will be available starting at 08:20 AM. Please check back then.'
                return
            } else if (this.queue.filter(song => song.created_by === this.user.id).length >= 4) {
                this.error = 'You have reached the maximum number of requests. Please wait for your songs to be played before adding more.'
                return
            }

            const processedUrl = this.processYouTubeUrl(this.url)
            if (!processedUrl) {
                this.error = 'Please enter a valid YouTube URL.'
                return
            }
            const ytID = extractVideoID(this.url)

            try {
                const videoDetails = await getVideoDetails(ytID)
                if (!videoDetails) {
                    this.error = 'Failed to fetch video details.'
                    return
                }

                const videoDurationInSeconds = parseISO8601Duration(videoDetails.duration);
                const maxDurationInSeconds = 8 * 60; // 8 minutes

                if (videoDurationInSeconds > maxDurationInSeconds) {
                    this.error = 'Video duration exceeds 6 minutes.';
                    return;
                }

                const { data, error } = await supabase
                    .from('songs')
                    .insert([
                        {
                            url: processedUrl,
                            note: this.note,
                            title: videoDetails.title,
                            duration: videoDetails.duration,
                            thumbnail: videoDetails.thumbnail,
                            created_at: new Date(),
                            artist: videoDetails.channelTitle,
                            artist_image: videoDetails.channelImage,
                            created_by: this.user.id,
                            created_name: this.user.user_metadata.full_name,
                        }
                    ])

                if (!error) {
                    this.$emit('song-added')
                    this.showInput = false
                    this.url = ''
                    this.note = ''
                    this.error = ''
                } else {
                    this.error = 'Failed to add the song.'
                }
            } catch (error) {
                console.error('Error adding song:', error.message)
                this.error = 'Failed to add the song.'
            }
        },
        processYouTubeUrl(url) {
            const regex = /^(https?\:\/\/)?(www\.youtube\.com|music\.youtube\.com|youtu\.?be)\/.+$/
            if (regex.test(url)) {
                let videoId = extractVideoID(url)
                return `https://www.youtube.com/embed/${videoId}`
            }
            return null
        },
    },
}
</script>
  
<style>
.group:hover .group-hover\:block {
    display: block;
}
</style>
  