<template>
    <div class="music-wave-container">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
    </div>
</template>
<style scoped>
.music-wave-container {
    display: flex;
    align-items: flex-end;
    gap: 0.25rem;
}

.wave {
    width: 1px;
    height: .5rem;
    background-color: #b0b0b0;
    animation: wave-animation 1s infinite ease-in-out;
    border-radius: 0.2rem;
}

.wave:nth-child(1) {
    animation-delay: 0s;
}

.wave:nth-child(2) {
    animation-delay: 0.3s;
}

.wave:nth-child(3) {
    animation-delay: 0.6s;
}

.wave:nth-child(4) {
    animation-delay: 0.9s;
}

.wave:nth-child(5) {
    animation-delay: 0.6s;
}

.wave:nth-child(6) {
    animation-delay: 0.3s;
}

.wave:nth-child(7) {
    animation-delay: 0s;
}

@keyframes wave-animation {

    0%,
    100% {
        transform: scaleY(.75);
    }

    50% {
        transform: scaleY(1.5);
    }
}
</style>