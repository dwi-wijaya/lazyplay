<template>
    <div class="mb-4">

        <form @submit.prevent="toggleInput" :class="['flex justify-between gap-4', { 'flex-col': showInput }]">
            <div class="flex justify-between flex-1">
                <h1 class="text-2xl font-bold">Song Queue</h1>
                <div class="flex gap-2 justify-end">
                    <button v-if="showInput" @click="showInput = false" type="button" class="btn !py-2 !px-3">
                        <i class="fas fa-xmark"></i>
                    </button>
                    <button type="submit" class="btn !py-2 !px-3">
                        <i class="fad fa-music"></i>Add Songs
                    </button>
                </div>
            </div>
            <div v-if="showInput" class="grid col-2 gap-1">
                <input ref="urlInput" v-model="url" type="url" placeholder="YouTube or Youtube Music URL" class="form-input" required />
                <input v-model="note" type="text" placeholder="Note" class="form-input" />
            </div>
        </form>
        <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
    data() {
        return {
            url: '',
            note: '',
            error: '',
            showInput: false
        }
    },
    methods: {
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

            let processedUrl = this.processYouTubeUrl(this.url)
            if (!processedUrl) {
                this.error = 'Please enter a valid YouTube URL.'
                return
            }

            try {
                const videoDetails = await this.getVideoDetails(processedUrl)
                if (!videoDetails) {
                    this.error = 'Failed to fetch video details.'
                    return
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
                            artist_image: videoDetails.channelImage
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
        async getVideoDetails(url) {
            try {
                let videoId = this.extractVideoId(url)
                if (!videoId) {
                    throw new Error('Invalid YouTube URL')
                }

                const videoApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${import.meta.env.VITE_GOOGLE_API_KEY}&part=snippet,contentDetails`
                const videoResponse = await fetch(videoApiUrl)
                if (!videoResponse.ok) {
                    throw new Error('Failed to fetch video details')
                }
                const videoData = await videoResponse.json()

                if (!videoData.items || videoData.items.length === 0) {
                    throw new Error('Video not found')
                }

                const video = videoData.items[0]
                const channelId = video.snippet.channelId

                const channelTitle = video.snippet.channelTitle

                let artistName = ''

                if (channelTitle.toLowerCase().includes('vevo')) {
                    // Use video title to extract artist name
                    const title = video.snippet.title
                    const titleParts = title.split('-')
                    if (titleParts.length > 1) {
                        artistName = titleParts[0].trim()
                    } else {
                        artistName = video.snippet.channelTitle.trim()
                    }
                } else {
                    artistName = video.snippet.channelTitle.trim()
                }

                // Get channel details
                const channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${import.meta.env.VITE_GOOGLE_API_KEY}&part=snippet`
                const channelResponse = await fetch(channelApiUrl)
                if (!channelResponse.ok) {
                    throw new Error('Failed to fetch channel details')
                }
                const channelData = await channelResponse.json()

                if (!channelData.items || channelData.items.length === 0) {
                    throw new Error('Channel not found')
                }

                const channel = channelData.items[0]


                return {
                    title: video.snippet.title,
                    duration: video.contentDetails.duration,
                    thumbnail: video.snippet.thumbnails.high.url,
                    channelTitle: artistName,
                    channelImage: channel.snippet.thumbnails.default.url
                }
            } catch (error) {
                console.error('Error fetching video details:', error.message)
                return null
            }
        },


        processYouTubeUrl(url) {
            const regex = /^(https?\:\/\/)?(www\.youtube\.com|music\.youtube\.com|youtu\.?be)\/.+$/
            if (regex.test(url)) {
                let videoId = this.extractVideoId(url)
                return `https://www.youtube.com/embed/${videoId}`
            }
            return null
        },
        extractVideoId(url) {
            const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
            const match = url.match(regExp)
            return (match && match[1]) || null
        }
    },
}
</script>
