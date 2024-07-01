// src/store/userStore.js
import { defineStore } from 'pinia';
import { supabase } from '@services/supabase'; // Import Supabase instance

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
    }),
    actions: {
        async fetchUser() {
            const session = await supabase.auth.getSession();
            this.user = session?.data.session.user ?? null;
        },
        async signOut() {
            await supabase.auth.signOut();
            this.user = null;
        },
    },
});
