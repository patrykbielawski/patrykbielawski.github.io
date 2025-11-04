<template>
    <div class="dropdown-menu">
        <ul>
            <li>
                <router-link to="/" @click="toggleMenu">Home</router-link>
            </li>
            <li>
                <router-link to="/list">Shopping List</router-link>
            </li>
            <li v-if="currentUser">
                <router-link to="/profile" @click="toggleMenu">Profile</router-link>
            </li>
            <li v-if="currentUser" class="logout-button">
                <router-link to="/" @click="handleLogout">Log Out</router-link>
            </li>
            <li v-else>
                <router-link to="/auth" @click="toggleMenu">Sign In</router-link>
            </li>
            <li>
                <router-link to="/contact">Contact</router-link>
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

    .dropdown-menu {
        position: fixed;
        top: 140px;
        left: 0;
        width: 45%;

        min-height: 100px;
        background-color: #f6f6f6;
        border-top: 1px solid #ddd;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 999;

        display: flex;
        flex-direction: column;
        padding: 20px 0;
        opacity: 0.95;
        padding: 20px 0;

    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        width: 100%;
    }

    li {
        padding: 10px 20px;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #4c6c8a;
        cursor: pointer;
        color: #4c6c8a;
    }

    li:hover {
        background-color: #4c6c8a;
        color: #d87c3c;
        transition: background-color 0.2s, color 0.2s;
        outline: 1px solid #d87c3c;
    }

    li:active {
        background-color: #384f67;
        transition: background-color 0.15s;
    }

    a {
        color: inherit;
        text-decoration: none;
        display: block;
        width: 100%;
    }

    a:hover {
        color: #d87c3c;
        transition: color 0.2s;
    }
    
    .logout-button:hover {
        background-color: #dc2626;
        color: white;
        transition: background-color 0.2s, color 0.2s;
        outline: 1px solid #4c6c8a;
    }

    .logout-button a:hover {
        color: #f6f6f6;
    }

    .logout-button:active {
        background-color: #b91c1c;
        color: white;
        transition: background-color 0.2s, color 0.2s;
    }

</style>