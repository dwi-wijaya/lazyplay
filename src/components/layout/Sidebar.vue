<template>
    <aside :class="['sidebar', className, { '!left-0': toggle }]" ref="sidebarRef">
        <div class="flex flex-col gap-8">
            <div class="ml-6 flex flex-col gap-8">
                <router-link to="/" class="w-fit mt-2">
                    <img src="/logo.png" width="35" alt="Logo" />
                </router-link>
                <div class="flex gap-2 flex-col">
                    <!-- <ThemeToggle /> -->
                    <!-- Add CollabsToggle here if needed -->
                </div>
            </div>
            <nav class="nav">
                <div class="nav__menu p-6 bg-background rounded-l-none rounded-2xl">
                    <ul class="flex flex-col items-center gap-y-6">
                        <li v-for="item in menuItems" :key="item.label" class="nav__item w-full group">
                            <router-link :to="item.href" class="flex items-center justify-between w-full transition-300">
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
        <div class="nav__footer text-left pl-6">
            <span class="text-subtext text-sm transform rotate-180">&copy; {{ new Date().getFullYear() }} Dwi Wijaya</span>
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
export default {
    // components: { ThemeToggle },
    data() {
        return {
            sidebarElement: null,
            toggle: false,
            menuItems: [
                { label: 'Dashboard', href: '/', iconClass: 'fad fa-home' },
                { label: 'Queue', href: '/queue', iconClass: 'fad fa-album-collection-circle-plus' },
                { label: 'Player', href: '/play', iconClass: 'fad fa-circle-play' },
                // Add more menu items as needed
            ],
        };
    },
    watch: {
        toggle(newValue) {
            this.handleBodyScroll(newValue);
            this.toggleSidebarClass(newValue);
        },
    },
    mounted() {
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
    methods: {
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
};
</script>
