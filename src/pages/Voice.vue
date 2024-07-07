<script setup>
import { onMounted, ref } from 'vue'
import { useSpeechSynthesis } from '@vueuse/core'

const voice = ref(undefined)
const text = ref('Hello world!') // More descriptive message

const speech = useSpeechSynthesis(text, {
  voice,
  pitch: 1,
  rate: 1,
})

let synth

const voices = ref([])

onMounted(async () => {
  if (speech.isSupported.value) {
    // Wait for voices to become available
    await new Promise((resolve) => {
      window.speechSynthesis.onvoiceschanged = resolve
    })

    // Get synth and voices
    synth = window.speechSynthesis
    voices.value = synth.getVoices()

    // Find a suitable voice (optional)
    const preferredVoice = voices.value.find(v => v.lang === 'en-US') // Example for US English
    voice.value = preferredVoice || voices.value[0] // Default to first voice if preferred not found

    // Speak the text after setting the voice
    speech.speak()
  } else {
    console.warn('Text-to-speech synthesis is not supported by your browser.')
  }
})
</script>

<template>
  </template>
