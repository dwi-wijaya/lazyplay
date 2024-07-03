<template>
    <div>
        <BackButton :to="'/'" />
        <div class="flex flex-col md:flex-row gap-4">
            <div class="card w-full  flex-1 h-full">
                <div class="flex justify-between">
                    <h1 class="font-semibold text-2xl">My Account</h1>
                    <div class="flex gap-4">
                        <router-link title="change password" to="/change-password"
                            class="group hover:text-primary flex gap-2 text-sm items-center">
                            <i class="fad fa-lock"></i>
                            <span class="hidden group-hover:underline underline-offset-4 base-transition sm:block">Change
                                Password</span>
                        </router-link>
                        <router-link title="update account" to="/account-edit"
                            class="group hover:text-primary flex gap-2 text-sm items-center">
                            <i class="fad fa-pen"></i>
                            <span class="hidden group-hover:underline underline-offset-4 base-transition sm:block">Update
                                Account</span>
                        </router-link>
                    </div>
                </div>
                <hr class="border-stroke my-4">
                <div class="flex gap-4 flex-col">
                    <img v-if="user?.user_metadata.avatar_url" :src="user?.user_metadata.avatar_url"
                        class="rounded-2xl  w-32 h-32 object-cover" />
                    <div v-else
                        class="font-medium text-lg p-12 rounded-2xl border w-fit h-full text-center bg-white flex items-center justify-center">
                        <i class="fad fa-user-headset"></i>
                    </div>
                    <div class="grid grid-cols-1  gap-2 ">
                        <div>
                            <p class="text-sm text-subtext">Name:</p>
                            <p class="font-semibold">{{ user?.user_metadata.full_name || user?.name }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-subtext">Email Address:</p>
                            <p class="font-semibold">{{ user?.email }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-subtext">Role:</p>
                            <p class="font-semibold">{{ userRole }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-subtext">Last Updated at:</p>
                            <p class="font-semibold">{{ useDateFormat(user?.updated_at, 'DD MMM, YYYY - HH:mm').value }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDateFormat } from '@vueuse/core';
import BackButton from '@components/partial/BackButton.vue';
import { useUserStore } from '@stores/user';

const route = useRoute();
const user = ref(null);

const fetchUser = async () => {
    const userStore = useUserStore();
    await userStore.fetchUser();
    user.value = userStore.user;
    console.log(user.value);
};

onMounted(async () => {
    await fetchUser();
});

const userRole = computed(() => {
    if (user.value?.user_metadata?.role) {
        const role = user.value.user_metadata.role;
        return role
            .replace(/(\w)(\w*)/g, function (_, firstChar, rest) {
                return firstChar.toUpperCase() + rest.toLowerCase();
            })
            .replace(/\s+/g, '');
    }
    return 'Public';
});
</script>
  