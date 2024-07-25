<!-- CardStat.vue -->
<template>
    <div class="card relative !bg-red-600 dark:!bg-red-100 !border-none">
        <div
            class="absolute -top-[0.35rem] mx-auto left-0 right-0 w-[85%] h-[0.35rem] rounded-t-xl bg-red-300 dark:bg-red-300">
        </div>
        <p class="font-bold text-3xl text-red-50 dark:text-red-600">{{ animatedValue }}</p>
        <p class="flex items-center gap-1 text-sm text-red-200 dark:text-red-400">
            <i :class="iconClass"></i>{{ label }}
        </p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
    value: Number,
    label: String,
    iconClass: String,
});

const animatedValue = ref(0);

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

watch(() => props.value, (newValue) => {
    animateCounter(animatedValue, newValue);
});
</script>
  
<style scoped>
.card {
    /* Tambahkan gaya CSS spesifik untuk card jika diperlukan */
}
</style>
  