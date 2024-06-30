<template>
    <div class="jumbotron relative mt-8 pt-52 md:pt-12 p-6 rounded-xl mb-6 border border-stroke bg-container ">
        <img src="/logo.png" class="absolute -top-6 left-6 w-14" alt="" srcset="">
        <div class="flex justify-between">
            <div class="w-full md:w-1/2">
                <h1 class="text-3xl font-bold text-red-500 dark:text-red-200 underline decoration-red-400 dark:decoration-red-300 underline-offset-4">Lazyplay.</h1>
                <p class="text-red-400 dark:text-red-300 leading-5 mt-2 text-sm">
                    Listen to music together and request your favorite song. <br>
                    Perfect for creating a fun atmosphere.
                </p>
                <router-link to="queue" class="btn mt-5 whitespace-nowrap !px-3">
                    <i class="fad fa-list-music"></i>
                    Request a song !
                </router-link>
            </div>
            <div>
                <img src="/lazy.svg" class="w-[275px] absolute -top-16 -right-1 xl:right-1" alt="" srcset="">
            </div>

        </div>
    </div>
</template>