<template>
        <div class="scroll relative flex w-full overflow-hidden " style="--time:60s">
            <div class="whitespace-nowrap py-1">
                <span class="scroll-item">
                    Coffee Break: 10.00 AM
                </span>
                <span class="scroll-item">
                    Dzuhur: 11.46 AM
                </span>
                <span class="scroll-item">
                    Ashar: 15.06 PM
                </span>
                <span class="scroll-item">
                    Go Home: 17.00 PM
                </span>
                <span class="scroll-item">
                    Magrib: 17.36 PM
                </span>
                <span class="scroll-item">
                    Isya: 18.50 PM
                </span>
            </div>
            <div class="whitespace-nowrap py-1">
                <span class="scroll-item">
                    Coffee Break: 10.00 AM
                </span>
                <span class="scroll-item">
                    Dzuhur: 11.46 AM
                </span>
                <span class="scroll-item">
                    Ashar: 15.06 PM
                </span>
                <span class="scroll-item">
                    Go Home: 17.00 PM
                </span>
                <span class="scroll-item">
                    Magrib: 17.36 PM
                </span>
                <span class="scroll-item">
                    Isya: 18.50 PM
                </span>
            </div>

    </div>
</template>
  
  
<style scoped>
.scroll-item {
    @apply bg-container dark:bg-slate-700 px-2 py-1 border border-stroke rounded-md text-sm inline-flex mx-1 hover:bg-slate-100 dark:hover:bg-slate-600 hover:ring-1 ring-offset-2 ring-slate-300 ring-offset-background dark:ring-slate-500 base-transition
}

.scroll {
    -webkit-mask-image: linear-gradient(90deg, transparent, #fff 20%, #fff 80%, transparent)
}

.scroll:hover div {
    animation-play-state: paused !important;
}

.scroll div {
    animation: scroll var(--time) linear infinite;
    animation-delay: calc(var(--time)*-1);

}

.scroll div:nth-child(2) {
    animation: scroll2 var(--time) linear infinite;
    animation-delay: calc(var(--time)/-2);
}

@keyframes scroll {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

@keyframes scroll2 {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-200%);
    }
}
</style>
