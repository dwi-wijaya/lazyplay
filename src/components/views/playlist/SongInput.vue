<template>
    <form @submit.prevent="toggleInput" :class="['flex justify-between gap-4 flex-col mb-4']">
        <h1 class="text-2xl font-bold">Song Playlist ({{ playlist.length }})</h1>

        <div class="flex mt-4">
            <button type="button"
                class="w-10 bg-container rounded-l-lg border-r-0 py-2 px-3 border border-stroke flex items-center hover:text-primary base-transition"
                @click="handleButtonClick">
                <i :class="buttonIcon"></i>
            </button>
            <input ref="urlInput" v-model="url" type="url" placeholder="YouTube or Youtube Music URL"
                class="form-input flex-1 !rounded-none" required />
            <button type="submit" class="btn !py-2 !px-3 disabled:cursor-not-allowed !rounded-l-none"
                :disabled="isPlaylistFull">
                <i class="fad fa-list-music"></i>
                Add
            </button>
        </div>
    </form>
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
        isPlaylistFull: {
            type: Boolean,
            required: true,
        }
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
        disableAddPlaylist() {
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
                this.$emit('handle-error', 'The YouTube URL you entered is invalid. Please check the URL and try again.');
                return
            }
            const ytID = extractVideoID(this.url)

            try {
                const videoDetails = await getVideoDetails(ytID)
                if (!videoDetails) {
                    this.$emit('handle-error', 'Unable to retrieve YouTube song details. Please try again later.');
                    return
                }

                const videoDurationInSeconds = parseISO8601Duration(videoDetails.duration);
                const maxDurationInSeconds = 8 * 60; // 8 minutes

                if (videoDurationInSeconds > maxDurationInSeconds) {
                    this.$emit('handle-error', 'The song duration exceeds the 6-minute limit. Please select a shorter video.');

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
                    this.$emit('handle-error', error.message)
                }
            } catch (error) {
                console.error('Error adding song:', error.message)
                this.$emit('handle-error', error.message)
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
