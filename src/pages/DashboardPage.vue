<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Popular Played Songs</h1>

        <div class="mb-4">
            <label for="timeRange" class="mr-2">Select Time Range:</label>
            <select id="timeRange" v-model="selectedTimeRange" @change="fetchPopularSongs">
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="1year">1 Year</option>
            </select>
        </div>

        <SongCard :songs="topSong" @delete-song="deleteSong" />
        <ArtisCard :artists="topArtist"/>
    </div>
</template>

<script>

import { supabase } from '../supabase'
import SongCard from '../components/SongCard.vue';
import ArtisCard from '../components/ArtisCard.vue';

export default {
    components: {
    SongCard,
    ArtisCard
},
    data() {
        return {
            topSong: [],
            topArtist: [],
            selectedTimeRange: '1day', // Default time range
        }
    },
    methods: {
        async fetchPopularSongs() {
            let now = new Date();
            let pastDate = new Date();

            // Set pastDate based on selected time range
            switch (this.selectedTimeRange) {
                case '1day':
                    pastDate.setDate(now.getDate() - 1);
                    break;
                case '1week':
                    pastDate.setDate(now.getDate() - 7);
                    break;
                case '1month':
                    pastDate.setMonth(now.getMonth() - 1);
                    break;
                case '3months':
                    pastDate.setMonth(now.getMonth() - 3);
                    break;
                case '1year':
                    pastDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    pastDate.setDate(now.getDate() - 1);
            }

            let { data: songs, errorSong } = await supabase
                .from('popular_songs')
                .select('*')
                .gte('created_at', pastDate.toISOString())
                .limit(12)
            let { data: artists, errorArtist } = await supabase
                .from('popular_artist')
                .select('*')
                .gte('created_at', pastDate.toISOString())
                .limit(6)
                console.log(artists);
                console.log(songs);
            if (!errorArtist && !errorSong) {
                this.topSong = songs;
                this.topArtist = artists;
            } else {
                console.error('Error fetching data:', error);
            }
        },
    },
    mounted() {
        this.fetchPopularSongs()
    },
}
</script>

<style scoped>
.container {
    @apply max-w-4xl mx-auto p-4;
}
</style>
