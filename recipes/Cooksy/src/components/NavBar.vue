<template>
  <nav
    ref="navElementRef"
    class="fixed top-0 left-0 w-full z-50 flex items-center border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 px-6 py-2"
    :class="[
      isSearchVisible && !isLargeDesktopProp 
        ? 'h-20 justify-start px-4' 
        : 'h-28 md:h-24 justify-between'
    ]"
  >
    <!-- Mobile Hamburger Button -->
    <div 
      class="md:hidden flex items-center justify-center cursor-pointer text-brand-blue hover:text-brand-orange transition-colors duration-200 select-none"
      :class="[isSearchVisible && !isLargeDesktopProp ? 'flex-none mr-3' : 'flex-1']"
      @click="toggleMenu"
    >
      <Transition name="icon-fade" mode="out-in">
        <span v-if="isMenuOpen" class="material-icons text-3xl">close</span>
        <span v-else class="material-icons text-3xl">menu</span>
      </Transition>
    </div>

    <!-- Logo Section -->
    <Transition name="fade-shrink">
      <div class="flex-1 flex justify-center items-center mx-auto" v-if="!isSearchVisible">
        <img class="h-16 md:h-20 w-auto object-contain" alt="Logo" src="../assets/logo.svg">
      </div>
    </Transition>

    <!-- Desktop Navigation Links -->
    <Transition name="fade-shrink">
      <div class="hidden md:flex flex-1 items-center justify-center gap-1 text-slate-400" v-if="!isSearchVisible">
        <router-link to="/">
          <button class="px-4 py-2 mx-1 text-sm font-semibold rounded-lg bg-brand-orange/85 text-white hover:bg-brand-blue hover:text-brand-orange hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer w-24">Home</button>
        </router-link>
        <span class="text-slate-300">|</span>
        <router-link to="/list">
          <button class="px-4 py-2 mx-1 text-sm font-semibold rounded-lg bg-brand-orange/85 text-white hover:bg-brand-blue hover:text-brand-orange hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer w-28">Shopping List</button>
        </router-link>
        <span class="text-slate-300">|</span>
        <template v-if="currentUser">
          <router-link to="/profile">
            <button class="px-4 py-2 mx-1 text-sm font-semibold rounded-lg bg-brand-orange/85 text-white hover:bg-brand-blue hover:text-brand-orange hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer w-24">Profile</button>
          </router-link>
          <span class="text-slate-300">|</span>
          <router-link to="/" @click="handleLogout">
            <button class="px-4 py-2 mx-1 text-sm font-semibold rounded-lg bg-brand-orange/85 text-white hover:bg-red-600 hover:text-white hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer w-24">Log Out</button>
          </router-link>
          <span class="text-slate-300">|</span>
        </template>
        <template v-else>
          <router-link to="/auth">
            <button class="px-4 py-2 mx-1 text-sm font-semibold rounded-lg bg-brand-orange/85 text-white hover:bg-brand-blue hover:text-brand-orange hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer w-24">Sign In</button>
          </router-link>
          <span class="text-slate-300">|</span>
        </template>
        <router-link to="/contact">
          <button class="px-4 py-2 mx-1 text-sm font-semibold rounded-lg bg-brand-orange/85 text-white hover:bg-brand-blue hover:text-brand-orange hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer w-24">Contact</button>
        </router-link>
      </div>
    </Transition>

    <!-- Search Section -->
    <div 
      class="flex-1 flex justify-center items-center m-0 p-0"
      :class="[
        isSearchVisible && !isLargeDesktopProp 
          ? 'flex-grow justify-end pr-2 gap-2' 
          : 'gap-1'
      ]"
    >
      <Transition name="search-grow">
        <input
          id="search-bar"
          type="text"
          placeholder="Search recipes..." 
          v-if="isLargeDesktopProp || isSearchVisible" 
          v-model="searchQuery" 
          ref="searchInputRef"
          @keyup.enter="submitSearch"
          class="text-sm border border-brand-blue rounded-lg focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 mx-auto w-0 px-0 border-0 lg:w-3/5 lg:px-3 lg:py-2 lg:border"
          :class="{ 'w-[80%] flex-grow px-3 py-2 border': isSearchVisible }"
        />
      </Transition>

      <Transition name="icon-fade" mode="out-in">
        <span 
          v-if="!isSearchVisible && !isLargeDesktopProp"
          class="material-icons text-3xl cursor-pointer text-brand-blue hover:text-brand-orange transition-colors select-none mx-auto active:scale-95" 
          @click="toggleSearch"
        >
          search
        </span>

        <span
          v-else-if="isSearchVisible && !isLargeDesktopProp"
          class="material-icons text-3xl cursor-pointer text-brand-blue hover:text-brand-orange transition-colors select-none mx-auto active:scale-95"
          @click="toggleSearch"
        >
          close
        </span>
      </Transition>

      <span
        v-if="isSearchVisible || isLargeDesktopProp"
        class="material-icons text-3xl cursor-pointer text-brand-blue hover:text-brand-orange transition-colors select-none mx-auto active:scale-95"
        @click="submitSearch"
      >
        send
      </span>
    </div>
  </nav>  
  <Transition name="dropdown-fade">
    <DropdownMenu v-if="isMenuOpen" />
  </Transition>
</template>

<script lang="ts">
import { ref, nextTick, watch, defineComponent, provide, } from 'vue';
import DropdownMenu from './DropdownMenu.vue';
import { useRouter } from 'vue-router';
import { useLogout } from '../composables/handleLogout';

export default defineComponent({
    name: 'NavBar',

    components: { DropdownMenu, },

    props: {
        isDesktopProp: {
            type: Boolean,
            required: true,
            default: false,
        },
        isLargeDesktopProp: {
            type: Boolean,
            required: true,
            default: false,
        },
    },

    emits: ['search-toggled'],

    setup(props, { emit }) {
        const navElementRef = ref(null);
        const isMenuOpen = ref(false);

        const searchQuery = ref('');
        const router = useRouter();

        const { currentUser, handleLogout } = useLogout();

        const logoutWithConfirmation = (event: Event) => {
            event.preventDefault();
            const confirmationCallback = () => {
                alert('You have been successfully logged out!');
            };
            handleLogout(confirmationCallback);
        }

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;   
            if (isMenuOpen.value) {
                isSearchVisible.value = false;

                emit('search-toggled');
            } 
        };

        const isSearchVisible = ref(false);
        const searchInputRef = ref<HTMLInputElement | null>(null);

        const toggleSearch = () => {
            isSearchVisible.value = !isSearchVisible.value;
            if (isSearchVisible.value) {
                isMenuOpen.value = false;
            }
            emit('search-toggled');
            if (isSearchVisible.value) {
                nextTick(() => {
                searchInputRef.value?.focus();
                });
            }
            };

        const searchTerm = ref('');

        const submitSearch = () => {
            const query = searchQuery.value.trim();
            if (query) {
                router.push({
                    name: 'SearchResults',
                    query: { q: query }
                });

                searchQuery.value = '';
            } else {
                console.warn('Search query is empty.');
            }

            if (isSearchVisible.value) {
                toggleSearch();
            }
        };

        watch(() => props.isDesktopProp, (isDesktop) => {
            if (isDesktop) {
                if (isMenuOpen.value) {
                    isMenuOpen.value = false;
                }
            }
        }, { immediate: true });

        watch(() => props.isLargeDesktopProp, (isLargeDesktop) => {
            if (isLargeDesktop) {
                if (isSearchVisible.value) {
                    isSearchVisible.value = false;
                    emit('search-toggled');
                }
                if (isMenuOpen.value) {
                    isMenuOpen.value = false;
                }
            }
        }, { immediate: true });

        provide('toggleMenu', toggleMenu);

        return {
            isSearchVisible, searchInputRef, toggleSearch,
            submitSearch, searchTerm, isMenuOpen,
            toggleMenu, navElementRef, searchQuery,
            currentUser, handleLogout: logoutWithConfirmation,
            
        }
    },
});
</script>

<style scoped>
    .dropdown-fade-enter-active,
    .dropdown-fade-leave-active {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }

    .dropdown-fade-enter-from,
    .dropdown-fade-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }

    .dropdown-fade-enter-to,
    .dropdown-fade-leave-from {
        opacity: 1;
        transform: translateY(0);
    }

    .search-grow-enter-active,
    .search-grow-leave-active {
        transition: all 0.15s ease-out;
    }

    .search-grow-enter-from,
    .search-grow-leave-to {
        width: 0 !important;
        padding: 0 !important;
        border-width: 0 !important;
        opacity: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .fade-shrink-enter-active,
    .fade-shrink-leave-active {
        transition: opacity 0.15s ease-out, transform 0.15s ease-out;
    }

    .fade-shrink-leave-to,
    .fade-shrink-enter-from {
        opacity: 0;
        transform: scale(0.9);
    }

    .icon-fade-enter-active,
    .icon-fade-leave-active {
        transition: all 0.2s ease-out;
    }

    .icon-fade-enter-from,
    .icon-fade-leave-to {
        opacity: 0;
        transform: scale(0.8);
    }

    .icon-fade-enter-to,
    .icon-fade-leave-from {
        opacity: 1;
        transform: scale(1);
    }
</style>