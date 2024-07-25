<template>
    <div class="mb-4">

        <form @submit.prevent="toggleInput" :class="['flex justify-between gap-4', { 'flex-col': showInput }]">
            <div class="flex justify-between flex-1">
                <h1 class="text-2xl font-bold">Song Playlist ({{ playlist.length }})</h1>
                <div class="flex gap-1 justify-end">
                    <button v-if="showInput" @click="showInput = false" type="button" class="btn !py-2 !px-2">
                        <i class="fas fa-xmark"></i>
                    </button>
                    <div class="relative group/btn">
                        <button type="submit" class="btn !py-2 !px-3 disabled:cursor-not-allowed"
                            :disabled="disableRequest">
                            <i class="fad fa-music"></i>Add Songs
                        </button>
                        <span v-if="disableRequest"
                            class="absolute left-0 border border-stroke top-10 mb-2 opacity-0 base-transition group-hover/btn:opacity-100 bg-container text-sm rounded py-1 px-2 z-20">
                            Playlist is full(20)
                        </span>
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
            </div>
        </form>
        <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>

<script>
import { supabase } from '@services/supabase'
import { getVideoDetails, extractVideoID } from '@services/youtube'
import { parseISO8601Duration } from '@helpers/durationHelper'
import { useUserStore } from '@stores/user';

export default {
    props: {
        playlist: {
            type: Array,
            required: true,
        },
        userQueue: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            url: '',
            error: '',
            showInput: false,
        }
    },
    computed: {
        buttonIcon() {
            return this.url != '' ? 'fad fa-trash' : 'fad fa-paste';
        },
        disableRequest() {
            return this.playlist.length >= 50
        }
    },
    methods: {
        getVideoDetails,
        extractVideoID,
        parseISO8601Duration,
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
                const userStore = useUserStore();
                await userStore.fetchUser();

                const { data, error } = await supabase
                    .from('playlist')
                    .insert([
                        {
                            url: processedUrl,
                            title: videoDetails.title,
                            duration: videoDetails.duration,
                            thumbnail: videoDetails.thumbnail,
                            created_at: new Date(),
                            artist: videoDetails.channelTitle,
                            artist_image: videoDetails.channelImage,
                            created_by: userStore.user.id,
                        }
                    ])

                if (!error) {
                    this.showInput = false
                    this.url = ''
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
