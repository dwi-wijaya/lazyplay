<template>
    <div class="flex">
        <input ref="urlInput" v-model="query" @input="onInput" type="url" placeholder="Ketik lagu favorit Anda"
            class="form-input !bg-container !border-neutral-300 dark:!border-stroke flex-1 !rounded-r-none" required />
        <button type="button" @click="onInput"
            class="w-10 bg-container py-2 px-3 rounded-r-md border !border-neutral-300 dark:!border-stroke flex items-center hover:text-primary base-transition">
            <i
                :class="{ 'fad fa-spinner fa-spin text-primary': isLoading, 'fad fa-music-magnifying-glass': !isLoading }"></i>
        </button>
    </div>
</template>
  
<script>
export default {
    props: {
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            query: ""
        };
    },
    methods: {
        onInput() {
            this.$emit('search', this.query);
        }
    }
};
</script>
  
<style scoped>
/* Add any component-specific styles here */
</style>
  