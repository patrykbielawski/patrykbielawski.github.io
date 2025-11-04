<template>
  <nav
    ref="navElementRef"
    :class="{ 'nav-search-expanded': isSearchVisible && !isLargeDesktopProp}"
    >

            <div class="menu" @click="toggleMenu">
                <Transition name="icon-fade" mode="out-in">
                    <span v-if="isMenuOpen" class="material-icons menu">close</span>
                    <span v-else class="material-icons menu">menu</span>
                </Transition>
            </div>

            <Transition name="fade-shrink">
                <div class="logo-container" v-if="!isSearchVisible">
                    <img class="logo" alt="Logo" src="../assets/logo.svg">
                </div>
            </Transition>    

            <Transition name="fade-shrink">
                <div class="routes" v-if="!isSearchVisible">
                    <router-link to="/"><button>Home</button></router-link> |
                    <router-link to="/list"><button>Shopping List</button></router-link> |
                    <template v-if="currentUser">
                        <router-link to="/profile"><button>Profile</button></router-link> |
                        <router-link to="/" @click="handleLogout"><button class="logout-button">Log Out</button></router-link> |
                    </template>
                    <template v-else>
                        <router-link to="/auth"><button>Sign In</button></router-link> |
                    </template>
                    <router-link to="/contact"><button>Contact</button></router-link>
                </div>
            </Transition>

            <div class ="search" :class="{ 'expanded': isSearchVisible }">
                <Transition name ="search-grow">
                    <input
                    id="search-bar"
                    type="text"
                    placeholder="Search recipes..." 
                    v-if="isLargeDesktopProp || isSearchVisible" 
                    v-model="searchQuery" 
                    ref="searchInputRef"
                    @keyup.enter="submitSearch"
                    :class="{ 'is-growing': isSearchVisible }"
                    />
                </Transition>

                <Transition name="icon-fade" mode="out-in">
                    <span 
                    v-if="!isSearchVisible && !isLargeDesktopProp"
                    class="material-icons search-button" 
                    @click="toggleSearch"
                    >
                    search
                    </span>

                    <span
                    v-else-if="isSearchVisible && !isLargeDesktopProp"
                    class="material-icons search-button"
                    @click="toggleSearch"
                    >
                    close
                    </span>
                </Transition>

                <span
                v-if="isSearchVisible || isLargeDesktopProp"
                class="material-icons search-button"
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
        const searchInputRef = ref(null);

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

    nav {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-height: 170px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    transition: max-height 0.15s ease-in-out;
    overflow: hidden;
    }

    nav.nav-search-expanded {
        max-height: 100px;
        transition: max-height 0.15s ease-in-out;
        justify-content: flex-start;
        padding-right: 0;
        padding-left: 10px;
    }

    nav.nav-search-expanded > .search {
        flex-grow: 1;
        justify-content: flex-end;
        padding-right: 10px;
    }

    nav.nav-search-expanded > .menu {
        margin-right: 10px;
        flex: 0;
    }

    .menu {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: center;
        font-size: 32px;
        cursor: pointer;
        padding: 0;
        margin: 0;
        color: #4c6c8a;
    }

    .menu:hover {
        color: #d87c3c;
        transition: color 0.2s;
    }

    .menu:active {
        transform: scale(0.95);
        transition: transform 0.1s;
    }

    .logo-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 0 auto;
    }

    .logo {
        flex: 1;
        height: 120px;
        width: auto;
        display: flex;
    }

    .routes {
        display: none;
    }

    .logout-button:hover {
        background-color: #dc2626;
        color: white;
        transform: scale(1.05);
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
        transition: all 0.2s;
        outline: #4c6c8a;
    }

    .logout-button:active {
         transform: scale(0.95);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.1s;
    }

    .search {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    #search-bar {
        padding: 0;
        border-width: 0;
        border: 1px solid #4c6c8a;
        border-radius: 4px;
        font-size: 0.8em;
        margin: 0 auto;
        width: 0;
        border-width: 0;
    }

    .search-button {
        font-size: 32px;
        cursor: pointer;
        margin: 0 auto;
        color: #4c6c8a;
    }

    .search-button:hover {
        color: #d87c3c;
        transition: color 0.2s;
    }

    .search-button:active {
        transform: scale(0.95);
        transition: transform 0.1s;
    }

    .expanded #search-bar.is-growing {
        width: 80%;
        padding: 8px;
        border-width: 1px;
    }

    .search.expanded {
        gap: 5px;
    }

    .expanded #search-bar {
        flex-grow: 1;
        width: 80%;
        padding: 0;
        border-width: 1px;
    }

    @media only screen and (min-width: 768px) {
        .routes {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            color: #4c6c8a;
        }

        .search {
            justify-content: center;
        }

        .search input {
            width: 60%;
            font-size: 1em;
        }

        .menu {
            display: none;
        }
    }

    @media only screen and (min-width: 1024px) {
        .logo {
            height: 200px;
        }

        .search {
            justify-content: space-between;
        }

        .search input {
            display: inline-block !important;
            width: 60%;
            font-size: 1em;
        }

        #search-bar {
            width: 60%;
            padding: 8px;
            border-width: 1px;
            max-width: none !important;
        }
    }

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

    .search .search-grow-enter-active,
    .search .search-grow-leave-active {
        transition: all 0.15s ease-out;
    }

    .search .search-grow-enter-from,
    .search .search-grow-leave-to {
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