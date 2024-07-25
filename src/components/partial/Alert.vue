<template>
    <div v-if="message" :class="alertClasses">
        <i :class="`fa-duotone fa-${icon} fa-lg`"></i>
        <span v-html="message"></span>
    </div>
</template>
  
<script setup>
import { computed } from 'vue';

const props = defineProps({
    message: String,
    icon: String,
    type: {
        type: String,
        default: 'info'
    }
})

const alertClasses = computed(() => {
    const baseClasses = 'text-sm border px-4 py-3 flex items-center gap-2 rounded-lg';
    const typeClasses = {
        info: 'bg-blue-50 dark:bg-container text-blue-800 dark:text-blue-400 border-blue-100 dark:border-stroke',
        danger: 'bg-red-50 dark:bg-container text-red-800 dark:text-red-400 border-red-100 dark:borde-stroke',
        warning: 'bg-yellow-50 dark:bg-container text-yellow-800 dark:text-yellow-400 border-yellow-100 dark:border-stroke',
        success: 'bg-green-50 dark:bg-container text-green-800 dark:text-green-400 border-green-100 dark:border-stroke'
    };

    return `${baseClasses} ${typeClasses[props.type] || typeClasses.info}`;
})
</script>
  
<style>
/* Additional styles, if any */
</style>
  