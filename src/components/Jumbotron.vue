<template>
    <div class="jumbotron relative mt-8 pt-48 md:pt-12 p-6 rounded-xl mb-6 border border-rose-700 bg-[#76110c] ">
        <img src="/logo.png" class="absolute -top-6 left-6 w-14" alt="" srcset="">
        <div class="flex justify-between">
            <div class="w-full md:w-1/2">
                <h1 class="text-3xl font-bold text-rose-300 underline decoration-rose-300 underline-offset-4">Lazyplay.</h1>
                <p class="text-rose-400 leading-5 mt-2 text-sm">
                    Listen to music together and request your favorite song. <br>
                    Perfect for creating a fun atmosphere.
                </p>
                <router-link to="queue" class="btn !bg-rose-200 mt-4 whitespace-nowrap !px-3 !py-2">
                    <i class="fad fa-list-music"></i>
                    Request a song !
                </router-link>
            </div>
            <div>

                <img src="/lazy.svg" class="w-64 absolute -top-16 -right-1 xl:right-1" alt="" srcset="">
            </div>

        </div>
    </div>
</template>