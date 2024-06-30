<template>
    <div class='group relative flex flex-col min-h-56 w-full' v-for="(song, index) in songs" :key="song.id">
        <div class='duration-500 relative h-full rounded-xl overflow-hidden'>
            <img :src="song.thumbnail" :alt="song.title"
                class='object-none w-full h-full transform transition-transform duration-300 group-hover:scale-[1.15] group-hover:blur-sm scale-[1.1]' />
            <div class="flex gap-2 top-3 right-3 absolute">
                <div v-if="index != 0"
                    class='z-10 !border-none shadow-slate-50 badge !text-base   bg-secondary flex items-center gap-1'>
                    <button @click="$emit('delete-song', song.id)" class="text-neutral-500 hover:text-red-500 text-sm"><i
                            class="fad fa-trash"></i>
                    </button>
                </div>
                <div class='z-10 !border-none shadow-slate-50 badge   bg-secondary flex items-center gap-1 text-sm'>
                    <template v-if="index == 0">
                        <i class="fad fa-spinner-third fa-spin text-primary"></i>
                    </template>
                    <template v-else>
                        {{ index }}
                    </template>
                </div>
            </div>
            <div
                class='absolute inset-0 bg-gradient-to-b from-black/40 to-black opacity-90 transition-opacity duration-300'>
            </div>
        </div>

        <div class='absolute flex flex-col justify-end p-5 space-y-4 h-full'>

            <div class='flex flex-col justify-end'>
                <div class='flex flex-col space-y-3 text-neutral-300'>

                    <h3
                        class='line-clamp-1 leading-5 !mt-1 font-medium text-neutral-100 group-hover:underline group-hover:underline-offset-4 '>
                        {{ song.title }}
                    </h3>
                    <div class='flex gap-1 items-center text-neutral-400 !mt-2'>
                        <i class='fal fa-calendar text-xs' />
                        <span class='text-xs ml-0.5'>{{ dateFormat(song.created_at, 'mmmm dd, yyyy - HH:MM') }}</span>
                    </div>
                    <div class='flex gap-1 items-center text-neutral-400 !mt-1'>
                        <i class='fal fa-note text-xs' />
                        <span class='text-xs ml-0.5 line-clamp-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Recusandae, quasi animi. Id magni, asperiores, voluptatem rerum in nulla mollitia, ea
                            necessitatibus porro quaerat eveniet neque vitae iure debitis nobis. Modi.</span>
                    </div>
                    <hr class="border-t border-neutral-500  my-4">
                    <div class="flex justify-between items-center text-neutral-400">
                        <div class="flex gap-2 items-center">
                            <i class="fal fa-user-circle text-sm"></i>
                            <small>Dwi Wijaya</small>
                        </div>
                        <div class="flex gap-2 items-center">
                            <div class="flex gap-2 items-center">
                                <small>{{ parseState(song.status) }}</small>
                                <i :class="['text-sm', stateIcon(song.status)]"></i>
                            </div>
                            <span class='text-xs font-medium ml-0.5'>
                                {{ parseDuration(song.duration) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { parseState, stateIcon } from '../helpers/stateHelper';
import { parseDuration } from '../helpers/durationHelper';
import dateFormat from "dateformat";

export default {
    props: {
        songs: {
            type: Array,
            required: true,
        },
    }, methods: {
        parseState,
        stateIcon,
        parseDuration,
        dateFormat
    }
}
</script>

