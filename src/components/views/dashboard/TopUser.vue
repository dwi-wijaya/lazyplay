<template>
    <div class="">
        <h3 class="text-text text-lg flex gap-2 font-semibold items-center">
            <i class="text-primary fad fa-award"></i> Top Contribution
        </h3>
        <p class="text-subtext mb-4 text-sm">This user has contributed the most songs!</p>
        <div class="grid grid-cols-5 gap-2 sm:gap-4">
            <div v-for="(user, index) in users" :key="index"
                class="group/user mb-2 flex flex-col justify-start base-transition">
                <div class="w-full relative mb-2 rounded-xl">
                    <img v-if="user.raw_user_meta_data.avatar_url" :src="user.raw_user_meta_data.avatar_url" alt=""
                        class="w-full rounded-xl object-cover aspect-square">
                    <div v-else
                        class="w-full rounded-xl object-cover aspect-square flex items-center justify-center bg-container border border-stroke">
                        <i class="fad fa-user-headset text-3xl"></i>
                    </div>
                    <div
                        class=" absolute top-0 left-0 w-full h-full rounded-xl bg-black opacity-0 transition-opacity duration-300 text-white group-hover/user:opacity-90">
                    </div>
                    <div
                        class="flex gap-2 items-center justify-center absolute top-0 left-0 w-full h-full rounded-xl opacity-0 transition-opacity duration-300 text-white group-hover/user:opacity-100">
                        <i class="fad fa-fire  text-xl xl:text-3xl"></i> {{ user.top_user }}
                    </div>
                </div>
                <p class="leading-5 text-center line-clamp-2 text-sm mx-1"><i class="fad fa-award text-primary" v-if="index == 0"></i>  {{ user.created_name }} </p>
            </div>
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
