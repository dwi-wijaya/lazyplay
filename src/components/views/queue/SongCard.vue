<template>
    <div class='group relative flex flex-col min-h-56 w-full' v-for="(song, index) in songs" :key="song.id">
        <div class='duration-500 relative h-full rounded-xl overflow-hidden'>
            <img :src="song.thumbnail" :alt="song.title"
                class='object-none w-full h-full transform transition-transform duration-300 group-hover:scale-[1.275] group-hover:blur-sm scale-[1.4]' />
            <div class="flex gap-2 top-3 right-3 absolute">
                <button
                    v-if="index != 0 && (user?.id == song.created_by || ['admin', 'operator'].includes(user.user_metadata.role))"
                    @click="$emit('delete-song', song.id)"
                    class='z-10 !border-none shadow-slate-50 badge !text-base bg-secondary flex items-center gap-1 text-neutral-500 hover:text-primary'>
                    <i class="fad fa-trash"></i>
                </button>
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
                class='absolute inset-0 bg-gradient-to-b from-black/40  to-black opacity-90 group-hover:opacity-100 transition-opacity duration-300'>
            </div>
        </div>

        <div class='absolute flex flex-col justify-end p-5 space-y-4 h-full w-full'>

            <div class='flex flex-col justify-end'>
                <div class='flex flex-col space-y-3 text-neutral-300'>
                    <h3 :title="song.title"
                        class='line-clamp-1 leading-5 !mt-1 group-hover:font-medium tracking-wider text-neutral-200 '>
                        {{ song.title }}
                    </h3>
                    <div class='flex gap-1 items-center text-neutral-400 !mt-2'>
                        <i class='fal fa-calendar text-xs' />
                        <span class='text-xs ml-0.5'>{{ useDateFormat(song.created_at, 'DD MMM, YYYY - HH:mm') }}</span>
                    </div>
                    <div class='hidden group-hover:flex gap-1 items-center text-neutral-400 !mt-1'>
                        <i class='fal fa-user-music text-xs' />
                        <span class='text-xs ml-0.5'>{{ song.artist }}</span>
                    </div>
                    <div class='group-hover:hidden flex gap-1 items-center text-neutral-400 !mt-1'>
                        <i class='fal fa-note text-xs' />
                        <span class='text-xs ml-0.5 line-clamp-1'>{{ song.note ? song.note : '-' }}</span>
                    </div>
                    <hr class="border-t border-neutral-600  my-4">
                    <div class="flex justify-between items-center text-neutral-400">
                        <div class="flex gap-2 items-center">
                            <i class="fal fa-user-circle text-sm"></i>
                            <small>{{ song.created_name }}</small>
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
import { parseState, stateIcon } from '../../../helpers/stateHelper';
import { parseDuration } from '../../../helpers/durationHelper';
import { useDateFormat, useNow } from '@vueuse/core'

export default {
    props: {
        songs: {
            type: Array,
            required: true,
        },
        user: {
            type: Object,
            required: true
        }
    }, methods: {
        parseState,
        stateIcon,
        parseDuration,
        useDateFormat,
    }
}
</script>

