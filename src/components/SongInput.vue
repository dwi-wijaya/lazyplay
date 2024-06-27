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

            const { data, error } = await supabase
                .from('songs')
                .insert([{ url: processedUrl, note: this.note }])

            if (!error) {
                this.$emit('song-added')
                this.url = ''
                this.note = ''
            } else {
                this.error = 'Failed to add the song.'
            }
        },
        processYouTubeUrl(url) {
            const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/
            if (regex.test(url)) {
                // Replace and format URL
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
  