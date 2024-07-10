<template>
    <Container class="!mb-0 !h-[calc(100vh-20rem)]">
        <div class="flex flex-col sm:flex-row gap-6">
            <div class="h-[calc(100vh-5rem)] overflow-x-auto scrollbar-hide pb-6 flex-1">
                <Jumbotron />

                <div class="flex justify-between">
                    <!-- <h1 class="text-2xl font-bold mb-4">Popular Played Songs</h1>

                    <div class="mb-4">
                        <select id="timeRange" class="p-2 border rounded-md focus:outline-none" v-model="selectedTimeRange"
                            @change="fetchDasboardSongs">
                            <option value="1day">1 Day</option>
                            <option value="1week">1 Week</option>
                            <option value="1month">1 Month</option>
                            <option value="3months">3 Months</option>
                            <option value="1year">1 Year</option>
                        </select>
                    </div> -->
                </div>

                <topUser :users="topUser" />
                <ArtisCard :artists="topArtist" />
                <TopSong :songs="topSong" />
                <RecentTracks :songs="recentTracks" />
            </div>
            <now-playing :currentSong="currentSong" :upcomingSongs="upcomingSongs" />
        </div>
    </Container>
</template>

<script>

import ArtisCard from '@components/views/dashboard/ArtisCard.vue';
import Container from '@components/layout/Container.vue';
import TopSong from '@components/views/dashboard/TopSong.vue';
import TopUser from '@components/views/dashboard/TopUser.vue';
import RecentTracks from '@components/views/dashboard/RecentTracks.vue';
import Jumbotron from '@components/views/dashboard/Jumbotron.vue';
import NowPlaying from '@components/views/dashboard/NowPlaying.vue';
import { supabase } from '@services/supabase'
import { parseState, stateIcon } from '@helpers/stateHelper';
import { useTitle } from '@vueuse/core'

export default {
    components: {
        ArtisCard,
        Container,
        TopSong,
        TopUser,
        RecentTracks,
        Jumbotron,
        NowPlaying
    },
    data() {
        return {
            topSong: [],
            topUser: [],
            topArtist: [],
            recentTracks: [],
            initialCurrentSong: {
                title: 'No song selected',
                artist: 'Unknown artist',
                status: -3
            },
            currentSong: {
                title: 'No song selected',
                artist: 'Unknown artist',
                status: -3
            },
            upcomingSongs: [],
            selectedTimeRange: '1day',
        }
    },
    methods: {
        parseState,
        stateIcon,
        async fetchDasboardSongs() {
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
                .limit(5)
            let { data: artists, errorArtist } = await supabase
                .from('popular_artists')
                .select('*')
                .limit(5)
            let { data: users, errorUser } = await supabase
                .from('top_users')
                .select('*')
                .limit(5)
            let { data: recentTracks, erroRecentTrack } = await supabase
                .from('songs')
                .select('*')
                .eq('status', 0)
                .order('created_at', { ascending: false })
                .limit(5)
            let { data: upcomingSongs, erroUpcomingSong } = await supabase
                .from('songs')
                .select('*')
                .eq('status', -2)
                .order('created_at', { ascending: true })
                .limit(20)
            if (!errorArtist && !errorSong && !erroRecentTrack && !erroUpcomingSong) {
                this.topSong = songs;
                this.topArtist = artists;
                this.topUser = users
                this.recentTracks = recentTracks
                this.upcomingSongs = upcomingSongs
            } else {
                console.error('Error fetching data:', error);
            }
        },
        async fetchUpcomingSongs() {
            let { data: upcomingSongs, erroUpcomingSong } = await supabase
                .from('songs')
                .select('*')
                .eq('status', -2)
                .order('created_at', { ascending: true })
                .limit(20)
            if (!erroUpcomingSong) {
                this.upcomingSongs = upcomingSongs
            } else {
                console.error('Error fetching upcoming song data:', error);
            }
        },
        async fetchPlayingSong() {
            let { data: currentSong, erroCurrentSong } = await supabase
                .from('songs')
                .select('*')
                .in('status', [-1, 1, 2, 5])
                .limit(1)
            if (!erroCurrentSong) {
                this.currentSong = currentSong.length == 0 ? this.initialCurrentSong : currentSong[0]
            } else {
                console.error('Error fetching current song data:', error);
            }
        },
        setupRealtime() {
            supabase
                .channel('realtime-songs')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, payload => {
                    console.log('Change received!', payload)
                    if (payload.new.status == 0) {
                        this.fetchDasboardSongs()
                        this.fetchPlayingSong()
                    } else if (payload.new.status == -2) {
                        this.fetchUpcomingSongs()
                    } else if ([-1, 1, 2, 5].includes(payload.new.status)) {
                        this.fetchUpcomingSongs()
                        this.fetchPlayingSong()
                    }
                })
                .subscribe()
        }
    },
    mounted() {
        this.fetchPlayingSong();
        this.fetchDasboardSongs();
        this.setupRealtime();
        useTitle('Dashboard - Lazyplay')
    },
}
</script>

