<template>
    <div class="dropdown-menu">
        <ul>
            <li><router-link to="/" @click="toggleMenu">Home</router-link></li>
            <li><router-link to="/">Recipes</router-link></li>
            <li><router-link to="/">Profile</router-link></li>
            <li><router-link to="/">Contact</router-link></li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, } from 'vue'
export default defineComponent ({
    name: 'DropdownMenu',

    setup() {
        const toggleMenu = inject('toggleMenu') as () => void;

        return {
            toggleMenu,
        }
    }

});


</script>

<style scoped>

    .dropdown-menu {
        position: absolute;
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

    .dropdown-menu ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        width: 100%;
    }

    .dropdown-menu li {
        padding: 10px 20px;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #4c6c8a;
        cursor: pointer;
        color: #4c6c8a;
    }

    .dropdown-menu li:hover {
        background-color: #4c6c8a;
        color: #d87c3c;
        transition: background-color 0.2s, color 0.2s;
        outline: 1px solid #d87c3c;
    }

    .dropdown-menu a {
        color: inherit;
        text-decoration: none;
    }

    .dropdown-menu a:hover {
        color: #d87c3c;
        transition: color 0.2s;
    }

</style>