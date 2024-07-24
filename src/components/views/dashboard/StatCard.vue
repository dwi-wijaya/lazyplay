<template>
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 gap-y-6">
        <div class="card relative !bg-red-500 dark:!bg-red-100 !border-none">
            <div
                class="absolute -top-[0.35rem] mx-auto left-0 right-0 w-[85%] h-[0.35rem] rounded-t-xl bg-red-300 dark:bg-red-300">
            </div>
            <p class="font-bold text-3xl text-red-50 dark:text-red-600">{{ animatedTotalRequest }}</p>
            <p class="flex items-center gap-1 text-sm text-red-200 dark:text-red-400">
                <i class="fad fa-list-music"></i>Total request
            </p>
        </div>
        <div class="card relative !bg-red-500 dark:!bg-red-100 !border-none">
            <div
                class="absolute -top-[0.35rem] mx-auto left-0 right-0  w-[85%] h-[0.35rem] rounded-t-xl bg-red-300 dark:bg-red-300">
            </div>
            <p class="font-bold text-3xl text-red-50 dark:text-red-600">{{ animatedMyRequest }}</p>
            <p class="flex items-center gap-1 text-sm text-red-200 dark:text-red-400">
                <i class="fad fa-user-music"></i>My request
            </p>
        </div>
        <div class="card relative !bg-red-500 dark:!bg-red-100 !border-none">
            <div
                class="absolute -top-[0.35rem] mx-auto left-0 right-0  w-[85%] h-[0.35rem] rounded-t-xl bg-red-300 dark:bg-red-300">
            </div>
            <p class="font-bold text-3xl text-red-50 dark:text-red-600">{{ animatedUniqueSong }}</p>
            <p class="flex items-center gap-1 text-sm text-red-200 dark:text-red-400">
                <i class="fad fa-music-note"></i> Unique Song
            </p>
        </div>
        <div class="card relative !bg-red-500 dark:!bg-red-100 !border-none">
            <div
                class="absolute -top-[0.35rem] mx-auto left-0 right-0  w-[85%] h-[0.35rem] rounded-t-xl bg-red-300 dark:bg-red-300">
            </div>
            <p class="font-bold text-3xl text-red-50 dark:text-red-600">{{ animatedUniqueArtist }}</p>
            <p class="flex items-center gap-1 text-sm text-red-200 dark:text-red-400">
                <i class="fad fa-microphone"></i> Unique Artist
            </p>
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
    totalRequest: Number,
    myRequest: Number,
    uniqueSong: Number,
    uniqueArtist: Number
});

const animatedTotalRequest = ref(0);
const animatedMyRequest = ref(0);
const animatedUniqueSong = ref(0);
const animatedUniqueArtist = ref(0);

const animateCounter = (target, endValue) => {
    gsap.to(target, {
        duration: 2,
        innerText: endValue,
        ease: 'power1.inOut',
        snap: { innerText: 1 },
        onUpdate() {
            target.value = Math.round(target.innerText);
        }
    });
};

watch(() => props.totalRequest, (newValue) => {
    animateCounter(animatedTotalRequest, newValue);
});

watch(() => props.myRequest, (newValue) => {
    animateCounter(animatedMyRequest, newValue);
});

watch(() => props.uniqueSong, (newValue) => {
    animateCounter(animatedUniqueSong, newValue);
});

watch(() => props.uniqueArtist, (newValue) => {
    animateCounter(animatedUniqueArtist, newValue);
});
</script>
