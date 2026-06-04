<template>
    <div class="fixed top-[112px] left-0 w-3/4 max-w-[280px] bg-white/95 backdrop-blur-md border-r border-slate-100 shadow-xl z-40 py-4 transition-all duration-300">
        <ul class="flex flex-col gap-1 px-3">
            <li class="rounded-lg overflow-hidden hover:bg-slate-50 transition-all duration-150">
                <router-link to="/" @click="toggleMenu" class="block w-full px-4 py-3 text-left text-sm font-semibold text-brand-blue hover:text-brand-orange">
                    Home
                </router-link>
            </li>
            <li class="rounded-lg overflow-hidden hover:bg-slate-50 transition-all duration-150">
                <router-link to="/list" @click="toggleMenu" class="block w-full px-4 py-3 text-left text-sm font-semibold text-brand-blue hover:text-brand-orange">
                    Shopping List
                </router-link>
            </li>
            <li v-if="currentUser" class="rounded-lg overflow-hidden hover:bg-slate-50 transition-all duration-150">
                <router-link to="/profile" @click="toggleMenu" class="block w-full px-4 py-3 text-left text-sm font-semibold text-brand-blue hover:text-brand-orange">
                    Profile
                </router-link>
            </li>
            <li v-if="currentUser" class="rounded-lg overflow-hidden hover:bg-red-50 transition-all duration-150">
                <router-link to="/" @click="handleLogout" class="block w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:text-red-700">
                    Log Out
                </router-link>
            </li>
            <li v-else class="rounded-lg overflow-hidden hover:bg-slate-50 transition-all duration-150">
                <router-link to="/auth" @click="toggleMenu" class="block w-full px-4 py-3 text-left text-sm font-semibold text-brand-blue hover:text-brand-orange">
                    Sign In
                </router-link>
            </li>
            <li class="rounded-lg overflow-hidden hover:bg-slate-50 transition-all duration-150">
                <router-link to="/contact" @click="toggleMenu" class="block w-full px-4 py-3 text-left text-sm font-semibold text-brand-blue hover:text-brand-orange">
                    Contact
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, } from 'vue';
import { useLogout } from '../composables/handleLogout';

type SuccessCallback = (userName: string | null) => void;
export default defineComponent ({
    name: 'DropdownMenu',

    setup() {
        const toggleMenu = inject('toggleMenu') as () => void;

        const { currentUser, handleLogout: authLogout } = useLogout();

        const handleLogout = (event: Event) => {
            event.preventDefault();
            toggleMenu();
            authLogout();
        };

        return {
            toggleMenu,
            currentUser,
            handleLogout,
        };
    }

});


</script>

<style scoped>
</style>