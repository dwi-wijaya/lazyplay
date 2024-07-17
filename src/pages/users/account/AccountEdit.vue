<template>
    <BackButton :to="'/account'" />
    <div class="card !p-5">
        <form @submit.prevent="updateUser" class="flex flex-col gap-3">
            <div
                class='group relative min-w-28 min-h-28 max-w-28 max-h-28 overflow-hidden border border-stroke rounded-2xl bg-background outline-subtext outline-offset-4 outline-dotted mb-2 ml-2 outline-2 base-transition'>
                <!-- Preview avatar jika sudah ada -->
                <img v-if="userMetadata.avatar_url || avatarPreview" :src="avatarPreview || userMetadata.avatar_url"
                    alt="Avatar Preview" class="object-cover min-w-28 min-h-28 aspect-square" />

                <div v-if="userMetadata.avatar_url || avatarPreview"
                    class="flex gap-1 absolute top-0 left-0 w-full h-full bg-black opacity-0 transition-opacity duration-300 justify-center items-center text-white group-hover:opacity-85 ">
                    <i class="fal fa-upload text-2xl"></i></div>
                    
                <!-- Placeholder untuk avatar default jika belum ada -->
                <div v-else class="flex items-center justify-center min-w-28 min-h-28 bg-background ">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 28 28"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <!-- Input untuk memilih file avatar baru -->
                <input type="file" accept="image/*" name='avatar' @change="handleImageChange"
                    class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            </div>
            <div class="form-group">
                <label for="full_name" class="font-medium">Full Name:</label>
                <input class="form-input" id="full_name" v-model="userMetadata.full_name" type="text" required>
            </div>
            <div class="form-group" v-if="!userMetadata.iss">
                <label for="email">Email:</label>
                <input class="form-input" id="email" v-model="user.email" type="email" required>
            </div>
            <p v-if="errorMessage" class="text-primary mt-2">{{ errorMessage }}</p>
            <div class="flex justify-end">
                <button type="submit" class="btn mt-4"><i class="fad fa-pen"></i>Update</button>
            </div>
        </form>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@services/supabase.js'; // Sesuaikan path sesuai struktur proyek Anda
import BackButton from '@components/partial/BackButton.vue';
import { useUserStore } from '@stores/user';
import { useTitle } from '@vueuse/core'

const router = useRouter();
const user = ref({});
const userMetadata = ref({});
const avatarFile = ref(null);
const errorMessage = ref('');
const avatarPreview = ref(null); // Untuk menyimpan preview avatar

const fetchUser = async () => {
    const userStore = useUserStore();
    await userStore.fetchUser();
    user.value = userStore.user;
    userMetadata.value = userStore.user.user_metadata;
};

const updateUser = async () => {
    try {
        if (avatarFile.value) {
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(`${user.value.id}.png`, avatarFile.value, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                errorMessage.value = 'Error uploading avatar: ' + error.message;
                console.error('Error uploading avatar:', error);
                return;
            }

            const { data: dataAvatar } = await supabase.storage
                .from('avatars')
                .getPublicUrl(`${user.value.id}.png`);

            userMetadata.value.avatar_url = dataAvatar.publicUrl;
        }

        const { error: updateError } = await supabase.auth.updateUser({
            email: user.value.email,
            data: {
                full_name: userMetadata.value.full_name,
                avatar_url: userMetadata.value.avatar_url,
            }
        });

        if (updateError) {
            errorMessage.value = 'Error updating user: ' + updateError.message;
            console.error('Error updating user:', updateError);
        } else {
            await supabase.auth.refreshSession();
            console.log('User updated successfully');
            router.push('/account');
        }
    } catch (error) {
        errorMessage.value = 'Error updating user: ' + error.message;
        console.error('Error updating user:', error);
    }
};

const handleImageChange = (event) => {
    const file = event.target.files[0];
    avatarFile.value = file;

    if (!file) return;

    // Menampilkan preview gambar yang dipilih
    const reader = new FileReader();
    reader.onload = () => {
        avatarPreview.value = reader.result;
    };
    reader.readAsDataURL(file);
};

onMounted(async () => {
    await fetchUser();
});
useTitle(computed(() => 'Account - ' + (user.value?.user_metadata?.full_name || 'User')));
</script>
