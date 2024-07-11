<template>
  <Container>
    <h1 class="text-2xl font-bold mb-4">Music Player</h1>
    <VideoSkeleton v-if="!currentSong" />
    <div v-if="currentSong">
      <VideoPlayer :song="currentSong" :autoplay="autoplay" :video-url="currentSong.url" @video-state="handleVideoState"
        @prev-song="setPrevSong" @skip-song="setNexSong" :BreakSchedule="BreakSchedule" @play-break="playBreak" @play-sayonara="playSayonara"
        @play-adzan="playAdzan" />
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
      autoplay: true,
      BreakSchedule: [
        { key: 'break', time: '10:0' },
        { key: 'dzuhur', time: '11:46' },
        { key: 'ashar', time: '15:6' },
        { key: 'maghrib', time: '17:36' },
        { key: 'isya', time: '23:19' },
        { key: 'home', time: '17:0' },
      ],
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
      this.autoplay != 'break' && await supabase
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
      this.autoplay = this.autoplay == 'break' ? false : true
      let { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .neq('status', 0)
        .order('created_at', { ascending: true })
        .limit(1);
      if (!error && songs.length > 0) this.currentSong = songs[0];
    },
    async playBreak() {
      this.autoplay = 'break'
      this.currentSong = {
        url: 'https://youtube.com/embed/OuMfyndwARQ',
        note: 'Take some break guys!',
        title: 'Break Time',
        duration: 'PT26S',
        thumbnail: 'https://i.ytimg.com/vi/JX29r4mR5KU/hqdefault.jpg',
        artist: 'System',
        artist_image: 'https://raw.githubusercontent.com/dwi-wijaya/lazyplay/main/assets/alarm.png',
        created_name: 'System',
      }
    },
    async playAdzan() {
      this.autoplay = 'break'
      this.currentSong = {
        url: 'https://youtube.com/embed/4QO93_G_YcM',
        note: 'Its pray time',
        title: 'Pray Time',
        duration: 'PT4M9S',
        thumbnail: 'https://i.ytimg.com/vi/4QO93_G_YcM/hqdefault.jpg',
        artist: 'System',
        artist_image: 'https://raw.githubusercontent.com/dwi-wijaya/lazyplay/main/assets/mosque.png',
        created_name: 'System',
      }
    },
    async playSayonara() {
      this.autoplay = 'break'
      this.currentSong = {
        url: 'https://youtube.com/embed/5U4nzEpB1aY',
        note: 'Its time to go home',
        title: 'Sayonara',
        duration: 'PT2M55S',
        thumbnail: 'https://i.ytimg.com/vi/5U4nzEpB1aY/hqdefault.jpg',
        artist: 'System',
        artist_image: 'https://raw.githubusercontent.com/dwi-wijaya/lazyplay/main/assets/home.png',
        created_name: 'System',
      }
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
  },
  mounted() {
    this.fetchNextSong();
    this.setupRealtime()
    this.fetchSongs();
    useTitle('Play - Lazyplay')
  },
};
</script>
    

  