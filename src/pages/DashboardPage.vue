<template>
    <Container>
        <div class="flex justify-between">
            <h1 class="text-2xl font-bold mb-4">Popular Played Songs</h1>

            <div class="mb-4">
                <select id="timeRange" class="p-2 border rounded-md focus:outline-none" v-model="selectedTimeRange"
                    @change="fetchPopularSongs">
                    <option value="1day">1 Day</option>
                    <option value="1week">1 Week</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="1year">1 Year</option>
                </select>
            </div>
        </div>

        <ArtisCard :artists="topArtist" />
        <TopSong :songs="topSong" />
        <RecentTracks :songs="recentTracks" />
    </Container>
</template>

<script>

import { supabase } from '../supabase'
import ArtisCard from '../components/ArtisCard.vue';
import Container from '../components/layout/Container.vue';
import TopSong from '../components/TopSong.vue';
import RecentTracks from '../components/RecentTracks.vue';

export default {
    components: {
        ArtisCard,
        Container,
        TopSong,
        RecentTracks
    },
    data() {
        return {
            topSong: [],
            topArtist: [],
            recentTracks: [],
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
                .limit(10)
            let { data: artists, errorArtist } = await supabase
                .from('popular_artists')
                .select('*')
                .limit(10)
            let { data: recentTracks, erroRecentTrack } = await supabase
                .from('songs')
                .select('*')
                .eq('status', 0)
                .order('created_at', { ascending: false })
                .limit(10)

            if (!errorArtist && !errorSong && !erroRecentTrack) {
                this.topSong = songs;
                this.topArtist = artists;
                this.recentTracks = recentTracks
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
