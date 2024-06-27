<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Playing...</h1>
      <div v-if="currentSong">
        <VideoPlayer :video-url="currentSong.url" @video-ended="handleVideoEnd" />
      </div>
      <hr>
      <SongList :songs="songs" @delete-song="deleteSong" />
    </div>
  </template>
    
  <script>
  import VideoPlayer from '../components/VideoPlayer.vue';
  import SongList from '../components/SongList.vue';
  import { supabase } from '../supabase';
  
  export default {
    components: {
      VideoPlayer,
      SongList,
    },
    data() {
      return {
        currentSong: null,
        songs: [],
      };
    },
    methods: {
      async fetchSongs() {
        let { data: songs, error } = await supabase
          .from('songs')
          .select('*')
          .eq('stat', 0)
          .order('created_at', { ascending: true })
          .limit(5);
        if (!error) this.songs = songs;
      },
      async deleteSong(play_id) {
        const { error } = await supabase
          .from('songs')
          .delete()
          .eq('id', play_id);
        if (!error) {
          this.fetchSongs();
        } else {
          console.error('Error deleting song:', error);
        }
      },
      async fetchNextSong() {
        let { data: songs, error } = await supabase
          .from('songs')
          .select('*')
          .eq('stat', 0)
          .order('created_at', { ascending: true })
          .limit(1);
        if (!error && songs.length > 0) this.currentSong = songs[0];
      },
      async handleVideoEnd() {
        if (this.currentSong) {
          await supabase
            .from('songs')
            .update({ stat: 1 })
            .eq('id', this.currentSong.id);
          this.currentSong = null;
          this.fetchSongs();
          this.fetchNextSong();
        }
      },
    },
    mounted() {
      this.fetchNextSong();
      this.fetchSongs();
    },
  };
  </script>
    
  <style scoped>
  .container {
    @apply max-w-4xl mx-auto p-4;
  }
  </style>
  