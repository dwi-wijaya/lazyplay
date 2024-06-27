<template>
    <div class="mb-4">
        <input v-model="url" type="url" placeholder="YouTube URL" class="border p-2 mb-2 w-full" />
        <input v-model="note" type="text" placeholder="Note" class="border p-2 mb-2 w-full" />
        <button @click="addSong" class="bg-blue-500 text-white p-2 rounded">Add Song</button>
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
            error: ''
        }
    },
    methods: {
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
                            stat: 0 // Assuming default status
                        }
                    ])

                if (!error) {
                    this.$emit('song-added')
                    this.url = ''
                    this.note = ''
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

                const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${import.meta.env.VITE_GOOGLE_API_KEY}&part=snippet,contentDetails`

                const response = await fetch(apiUrl)
                if (!response.ok) {
                    throw new Error('Failed to fetch video details')
                }
                const data = await response.json()

                if (!data.items || data.items.length === 0) {
                    throw new Error('Video not found')
                }

                const video = data.items[0]
                return {
                    title: video.snippet.title,
                    duration: video.contentDetails.duration,
                    thumbnail: video.snippet.thumbnails.default.url
                }
            } catch (error) {
                console.error('Error fetching video details:', error.message)
                return null
            }
        },

        processYouTubeUrl(url) {
            const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/
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

<style scoped>
input {
    @apply border p-2 mb-2 w-full;
}

button {
    @apply bg-blue-500 text-white p-2 rounded;
}
</style>
