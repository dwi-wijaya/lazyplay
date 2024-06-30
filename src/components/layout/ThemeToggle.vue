<template>
    <div class="w-full p-1 bg-background rounded-2xl border border-stroke">
        <label class="relative flex h-10 items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" :checked="isDark" @change="toggleTheme()" />
            <div
                class="slider bg-background peer-checked:bg-background flex rounded-2xl justify-between items-center w-full h-full transition-all duration-300 relative">
                <span
                    class="absolute left-0 w-1/2 h-full bg-container border border-stroke rounded-xl transition-all duration-300 transform"
                    :class="{ 'translate-x-full': isDark }" style="content: ''; z-index: 1;" />
                <p class="z-10 pl-4 leading-4 flex items-center gap-2 text-slate-500"
                    :class="{ '!text-slate-800': !isDark }">
                    <i class="bx bxs-sun"></i>Light
                </p>
                <p class="z-10 pr-4 leading-4 flex items-center gap-2 text-slate-500"
                    :class="{ '!text-slate-300': isDark }">
                    <i class="bx bxs-moon rotate-45"></i>Dark
                </p>
            </div>
        </label>
    </div>
</template>
  
<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleTheme = useToggle(isDark);
</script>
