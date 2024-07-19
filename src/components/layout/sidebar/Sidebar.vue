<template>
    <aside :class="['sidebar', className, { '!left-0': toggle }]" ref="sidebarRef">
        <div class="flex flex-col gap-8">
            <div class="ml-6 flex flex-col gap-8">
                <router-link to="/" class="w-fit mt-2">
                    <img src="/logo.png" width="56" alt="Logo" />
                </router-link>
            </div>
            <div class="ml-6 mt-5 text-left">
                <h1 class="text-2xl text-text font-medium mb-1">Lazyplay</h1>
                <p class="text-sm flex items-center gap-2"><i class="text-primary fad fa-mug-hot"></i> <span
                        class="mt-[.125rem]">{{ greetingMessage }}</span>
                </p>
                <h3 class="text-sm flex items-center gap-2"><i class="text-primary fad fa-fire"></i>
                    Welcome, {{ firstName }}
                </h3>
            </div>
            <nav class="nav">
                <div class="nav__menu p-6 bg-background rounded-l-none rounded-2xl border border-stroke border-l-0">
                    <ul class="flex flex-col items-center gap-y-6">
                        <li v-for="item in filteredMenuItems" :key="item.label" class="nav__item w-full group">
                            <router-link :to="item.href"
                                :class="['flex items-center justify-between w-full transition-300 hover:text-primary', isActiveRoute(item.href) ? 'text-primary' : '']">
                                <span class="flex items-center gap-3">
                                    <i
                                        :class="[item.iconClass, 'min-w-5 flex justify-center items-center group-hover:-rotate-[8deg] duration-300 transition-all']"></i>
                                    {{ item.label }}
                                </span>
                                <i v-if="isActiveRoute(item.href)" class="fad fa-arrow-right animate-pulse"></i>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>

        <div class="flex gap-3 flex-col ml-6">
            <div
                class="group flex flex-col gap-2 items-center bg-background border border-stroke px-4 py-3 rounded-2xl base-transition text-base hover:text-primary">
                <div class="flex items-center gap-2 font-semibold">
                    Upgrade to PRO
                <i class="fad fa-fire text-primary group-hover:-rotate-[8deg] transition-300 duration-300 transition-all"></i>
                </div>
                <div class="text-subtext text-sm"> Unlock and Get Premium Features and More. </div>
                <a href="https://wa.me/6287700304010" target="_blank" class="btn mt-3 mb-1 text-sm !rounded-xl !px-4 !py-3 !w-full justify-center !font-medium"> Upgrade <i class="group-hover:ml-1 base-transition fad fa-arrow-right"></i></a>
            </div>
            <!-- <div
                class="group flex gap-2 items-center bg-background border border-stroke px-4 py-3 rounded-2xl text-base hover:text-primary">
                <i class="fad fa-glass-cheers group-hover:-rotate-[8deg] transition-300 duration-300 transition-all"></i>
                Cheers, Bobababa
            </div> -->
            <a href="https://saweria.co/dwiwijaya"
                target="_blank"
                class="group flex gap-2 items-center bg-background border border-stroke px-4 py-3 rounded-2xl text-base hover:text-primary">
                <i class="fad fa-gift group-hover:-rotate-[8deg] transition-300 duration-300 transition-all"></i>
                Support Developer
            </a>
            <hr class="my-2 border-stroke">
            <ThemeToggle />
            <ProfileLink />
            <Signout />
        </div>

        <div @click="toggleSidebar" class="toggle lg:-left-64 left-5 sidebar__toggle" :class="{ '!left-[17rem]': toggle }">
            <i class="fa-duotone fa-bars text-primary"></i>
        </div>
    </aside>
</template>
  
<script>
// import ThemeToggle from './ThemeToggle.vue';
// Import CollabsToggle if needed
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ThemeToggle from './ThemeToggle.vue';
import Signout from './Signout.vue';
import ProfileLink from './ProfileLink.vue';
import { useUserStore } from '@stores/user';

export default {
    // components: { ThemeToggle },
    data() {
        return {
            sidebarElement: null,
            toggle: false,
            currentTime: '',
            greetingMessage: '',
            firstName: '',
            userRole: '',
            menuItems: [
                { label: 'Dashboard', href: '/', iconClass: 'fad fa-home', accessSible: ['admin', 'public', 'operator'] },
                { label: 'Browse', href: '/browse', iconClass: 'fad fa-music-magnifying-glass', accessSible: ['admin', 'public', 'operator'] },
                { label: 'Queue', href: '/queue', iconClass: 'fad fa-signal-stream', accessSible: ['admin', 'public', 'operator'] },
                { label: 'Player', href: '/play', iconClass: 'fad fa-circle-play', accessSible: ['admin', 'operator'] },
                { label: 'Playlist', href: '/playlist', iconClass: 'fad fa-list-music', accessSible: ['admin', 'operator', 'public',] },
                { label: 'Recents', href: '/recent', iconClass: 'fad fa-clock-rotate-left', accessSible: ['admin', 'operator', 'public',] },
                { label: 'Users', href: '/users', iconClass: 'fad fa-users', accessSible: ['admin'] },
            ],
        };
    },
    watch: {
        toggle(newValue) {
            this.handleBodyScroll(newValue);
            this.toggleSidebarClass(newValue);
        },
    },
    computed: {
        filteredMenuItems() {
            return this.menuItems.filter(item => item.accessSible.includes(this.userRole));
        }
    },
    mounted() {
        this.userStore()
        this.sidebarElement = document.querySelector('.sidebar');
        document.addEventListener('mousedown', this.handleClickOutside);
        window.addEventListener('resize', this.handleResize);
        this.toggleSidebarClass(this.toggle);
    },
    beforeUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        window.removeEventListener('resize', this.handleResize);
        document.body.style.overflow = '';
    },
    created() {
        this.updateTime();
        this.updateGreeting();
        setInterval(() => {
            this.updateTime();
            this.updateGreeting();
        }, 60000); // Update setiap menit
    },

    methods: {
        async userStore() {
            const userStore = useUserStore();
            await userStore.fetchUser();
            this.firstName = userStore.user?.user_metadata.full_name;
            this.userRole = userStore.user?.user_metadata.role || 'public';
        },
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        updateGreeting() {
            const now = new Date();
            const hour = now.getHours();
            if (hour < 12) {
                this.greetingMessage = 'Good morning!';
            } else if (hour < 18) {
                this.greetingMessage = 'Good afternoon!';
            } else {
                this.greetingMessage = 'Good evening!';
            }
        },
        isActiveRoute(href) {
            return this.$route.path === href;
        },
        handleClickOutside(event) {
            if (this.sidebarElement && !this.sidebarElement.contains(event.target)) {
                this.toggle = false;
            }
        },
        handleBodyScroll(toggle) {
            toggle ?
                document.body.style.overflow = 'hidden' :
                document.body.style.overflow = '';
        },
        handleResize() {
            if (window.innerWidth <= 1024) {
                this.toggle = false; // If the screen width is <= 1024px, close the sidebar
            }
        },
        toggleSidebarClass(toggle) {
            const mainElement = document.querySelector('main');
            toggle ? mainElement.classList.add('sidebar-expanded') :
                mainElement.classList.remove('sidebar-expanded');
        },
        isActiveRoute(route) {
            return this.$router.currentRoute.value.path === route;
        },
        toggleSidebar() {
            this.toggle = !this.toggle;
        },
    },
    components: { ThemeToggle, Signout, ProfileLink }
};
</script>
