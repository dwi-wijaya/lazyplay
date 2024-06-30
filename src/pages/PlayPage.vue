<template>
  <Container>
    <h1 class="text-2xl font-bold mb-4">Music Player</h1>
    <div v-if="currentSong">
      <VideoPlayer :song="currentSong" :video-url="currentSong.url" @video-state="handleVideoState"
        @prev-song="setPrevSong" @skip-song="setNexSong" />
    </div>
    <SongList :songs="songs" @delete-song="deleteSong" />
  </Container>
</template>
    
<script>
import VideoPlayer from '@components/views/player/VideoPlayer.vue';
import SongList from '@components/views/player/SongList.vue';
import Container from '@components/layout/Container.vue';
import { supabase } from '@services/supabase';

export default {
  components: {
    VideoPlayer,
    SongList,
    Container
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
  },
  mounted() {
    this.fetchNextSong();
    this.setupRealtime()
    this.fetchSongs();
  },
};
</script>
    

  