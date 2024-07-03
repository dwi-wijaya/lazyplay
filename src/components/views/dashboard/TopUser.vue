<template>
    <h3 class="text-text text-lg mt-6 flex gap-2 font-semibold items-center">
        <i class="text-primary fad fa-microphone"></i> Top User
    </h3>
    <p class="text-subtext mb-4 text-sm">This user has contributed the most songs!</p>
    <div class="grid grid-cols-6 gap-4">
        <div v-for="(user, index) in users" :key="index" class="group/user mb-2 flex flex-col justify-start base-transition">
            <div class="w-full relative mb-2 rounded-xl">
                <img :src="user.raw_user_meta_data.avatar_url" alt="" class="w-full rounded-xl object-cover aspect-square">
                <div class="flex gap-1 absolute top-0 left-0 w-full h-full rounded-xl bg-black opacity-0 transition-opacity duration-300 justify-center items-center text-white group-hover/user:opacity-85">
                    <i class="fad fa-fire text-primary"></i> {{ user.top_user }}
                </div>
            </div>
            <p class="leading-5 text-center line-clamp-2 text-sm">{{ user.created_name }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
    },
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
