<template>
    <div class="p-5 rounded-xl border bg-container border-stroke">
        <div class="border border-stroke rounded-xl w-full h-[30rem]  animate-pulse">
            <div class="bg-neutral-100 dark:bg-background rounded-xl w-full h-full"></div>
        </div>
        <div class="flex justify-between gap-3 mt-5 flex-col sm:flex-row">
            <div class="flex gap-2 animate-pulse">
                <div
                    class="bg-neutral-100 dark:bg-background border border-stroke w-12 h-12 rounded-md object-cover flex items-center justify-center">
                    <i class="fad fa-record-vinyl text-xl text-neutral-300"></i>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="bg-neutral-100 dark:bg-background rounded-md line-clamp-1 font-semibold  w-32 h-5"></p>
                    <p class="bg-neutral-100 dark:bg-background rounded-md text-sm text-text line-clamp-1  w-16 h-4">
                    </p>
                </div>
            </div>
            <div class="flex gap-2 border-t pt-3 sm:border-t-0 sm:pt-0 items-center mr-1 justify-between sm:justify-start">
                <button disabled class="btn !bg-red-400 dark:!bg-red-300 !px-3 !py-2 h-fit">
                    <i class="fad fa-timer"></i> --:--
                </button>
                <div class="flex gap-2">
                    <button disabled class="btn !bg-red-400 dark:!bg-red-300 !px-3 !py-2 h-fit">
                        <i class="fas fa-volume"></i>
                    </button>
                    <button disabled class="btn !bg-red-400 dark:!bg-red-300 !px-3 !py-2 h-fit">
                        <i class="fad fa-backward"></i>
                    </button>
                    <button disabled class="btn !bg-red-400 dark:!bg-red-300 !px-3 !py-2 h-fit">
                        <i class="fas fa-play"></i>
                    </button>
                    <button disabled class="btn !bg-red-400 dark:!bg-red-300 !px-3 !py-2 h-fit">
                        <i class="fas fa-stop"></i>
                    </button>
                    <button disabled class="btn !bg-red-400 dark:!bg-red-300 !px-3 !py-2 h-fit">
                        <i class="fad fa-forward"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>