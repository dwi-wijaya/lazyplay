<template>
  <Container>
    <h1 class="text-2xl font-bold mb-4">Music Player</h1>
    <VideoSkeleton v-if="!currentSong" />
    <div v-if="currentSong">
      <VideoPlayer :song="currentSong" :video-url="currentSong.url" @video-state="handleVideoState"
        @prev-song="setPrevSong" @skip-song="setNexSong" :prayerSchedule="prayerSchedule" />
    </div>
    <div class="mt-8">
      <div v-if="songs.length == 0" class="text-subtext flex items-center gap-2"><i class="fad fa-list-music"></i>The
        Queue are currently
        empty, add some songs!</div>
      <SongList v-else :songs="songs" @delete-song="deleteSong" />
    </div>
  </Container>
</template>
    
<script>
import VideoPlayer from '@components/views/player/VideoPlayer.vue';
import VideoSkeleton from '@components/views/player/VideoSkeleton.vue';
import SongList from '@components/views/player/SongList.vue';
import Container from '@components/layout/Container.vue';
import { supabase } from '@services/supabase';
import dayjs from 'dayjs';
import axios from 'axios';
import { useTitle } from '@vueuse/core'

export default {
  async beforeRouteLeave(to, from, next) {
    if (this.currentSong) await supabase
      .from('songs')
      .update({ status: -1 })
      .eq('id', this.currentSong.id);
    next();
  },
  components: {
    VideoPlayer,
    VideoSkeleton,
    SongList,
    Container
  },
  data() {
    return {
      currentSong: null,
      songs: [],
      prayerSchedule: {
        subuh: '04:31',
        dzuhur: '11:46',
        ashar: '13:45',
        maghrib: '18:00',
        isya: '18:50',
        date: dayjs().format('YYYY-MM-DD'),
      },
    };
  },
  methods: {
    async fetchSongs() {
      let { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .eq('status', -2)
        .order('created_at', { ascending: true })
        .limit(5);
      if (!error) this.songs = songs;
    },
    async setPrevSong() {
      await supabase
        .from('songs')
        .update({ status: -2 })
        .eq('id', this.currentSong.id);
      await supabase
        .from('songs')
        .update({ status: -1 })
        .eq('status', 0)
        .order('created_at', { ascending: false })
        .limit(1);
      this.currentSong = null;
      this.fetchNextSong();
    },
    async setNexSong() {
      await supabase
        .from('songs')
        .update({ status: 0 })
        .eq('id', this.currentSong.id);
      this.currentSong = null;
      this.fetchNextSong();

    },
    async deleteSong(play_id) {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', play_id);
      if (error) {
        console.error('Error deleting song:', error);
      }
    },
    async fetchNextSong() {
      let { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .neq('status', 0)
        .order('created_at', { ascending: true })
        .limit(1);
      if (!error && songs.length > 0) this.currentSong = songs[0];
    },
    async handleVideoState(status) {
      if (this.currentSong) {
        await supabase
          .from('songs')
          .update({ status: status })
          .eq('id', this.currentSong.id);
        if (status == 0) {
          this.currentSong = null;
          this.fetchNextSong();
        }
      }
    },
    setupRealtime() {
      supabase
        .channel('realtime-songs')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, payload => {
          console.log('Change received!', payload)
          this.fetchSongs()
          if (payload.new.status == -2 && this.songs.length == 0) {
            this.fetchNextSong()
          }
        })
        .subscribe()
    },
    async fetchPrayerSchedule() {
      try {
        const today = dayjs().format('YYYY-MM-DD');

        const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/1501/${today}`)
        const jadwalData = response.data.data.jadwal;
        // this.prayerSchedule = {
        //   subuh: jadwalData.subuh,
        //   dzuhur: jadwalData.dzuhur,
        //   ashar: jadwalData.ashar,
        //   maghrib: jadwalData.maghrib,
        //   isya: jadwalData.isya,
        //   date: today
        // };
      } catch (error) {
        console.error('Error fetching jadwal:', error);
      }
    },

  },
  mounted() {
    this.fetchNextSong();
    this.setupRealtime()
    this.fetchSongs();
    this.fetchPrayerSchedule();
    useTitle('Play - Lazyplay')
  },
};
</script>
    

  