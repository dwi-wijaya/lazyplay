<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Playing...</h1>
    <div v-if="currentSong">
      <VideoPlayer :video-url="currentSong.url" @video-state="handleVideoState" @prev-song="setPrevSong"
        @skip-song="setNexSong" />
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
        .neq('status', 0)
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
        .update({ status: -2 })
        .eq('id', this.currentSong.id - 1)
        .order('created_at', { ascending: true }).limit(1);
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
  },
  mounted() {
    this.fetchNextSong();
    this.setupRealtime()
    this.fetchSongs();
  },
};
</script>
    
<style scoped>
.container {
  @apply max-w-4xl mx-auto p-4;
}
</style>
  