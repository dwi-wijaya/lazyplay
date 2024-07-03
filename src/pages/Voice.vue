<template>
    <main>
      <h1>Text To Speech</h1>
      <button @click="speak">Speak</button>
    </main>
  </template>
  
  <script>
  export default {
    name: 'TextToSpeech',
    methods: {
      speak() {
        // Create a SpeechSynthesisUtterance
        const utterance = new SpeechSynthesisUtterance("Welcome to this tutorial!");
  
        // Select a voice
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[0]; // Choose a specific voice
  
        // Speak the text
        speechSynthesis.speak(utterance);
      }
    },
    mounted() {
      // Call speak function when the component is mounted (if needed)
      // this.speak();
    }
  }
  </script>
  
  <style scoped>
  /* Tambahkan gaya khusus di sini jika diperlukan */
  </style>
  