<template>
    <div class="meal-card">
        <div class="card-image-container">
            <router-link :to="`/recipe/${recipeId}`">
                <img :src="recipe.strMealThumb" :alt="recipe.strMeal" class="meal-thumb">                
            </router-link>

            <span
                class="material-symbols-outlined fav"
                :class="{
                    favorited: isFavorite,
                    'is-loading': isFavLoading
                }"
                @click="toggleFav"
                :style="{ cursor: isFavLoading ? 'wait' : 'pointer' }"
            >
                favorite
            </span>
        </div>

        <div class="card-content">
            <router-link :to="`/recipe/${recipeId}`" class="recipe-title-link">
                <h3>{{ recipe.strMeal }}</h3>
            </router-link>

            <div class="separator">
                <div class="line"></div>
            </div>

            <div class="recipe-info">
                <p><strong>Category:</strong> {{ recipe.strCategory }}</p>
                <p><strong>Area:</strong> {{ recipe.strArea }}</p>
            </div>

            <router-link :to="`/recipe/${recipeId}`">
                <button>View Recipe</button>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { useFav } from '../composables/useFav';

interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string | null;
    strArea: string | null;
    strMealThumb: string;
}

export default defineComponent({
    name: 'RecipeCard',
    props: {
        recipe: {
            type: Object as PropType<Meal>,
            required: true,
        },
    },

    setup(props) {
        const recipeId = computed(() => props.recipe.idMeal);

        const {
            isFavorite,
            toggleFav,
            isLoading: isFavLoading
        } = useFav(recipeId.value);

        const handleToggleFav = () => {
            toggleFav(recipeId.value);
        };

        return {
            recipeId,
            recipe: props.recipe,
            isFavorite,
            isFavLoading,
            toggleFav: handleToggleFav,
        };
    }
});
</script>

<style scoped>
    .meal-card {
        box-shadow: 0px 0px 6px #4c6c8aBF;
        border-radius: 1em;
        padding: 10px;
        display: flex;
        flex-direction: column;
        text-align: center;
        height: auto;
        max-width: 300px;
    }

    .card-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 10px;
    }

    .meal-card button {
        width: 60%;
    }

    .meal-thumb {
        height: auto;
        width: 100%;
        border-radius: 1em;
    }

    .separator {
        position: relative;
        padding: 5px 0;
    }

    a {
        text-decoration: none;
        font-size: 1.2rem;
    }

    h3,
    strong {
        color: #4c6c8a;
        text-shadow: none;
    }

    h3 {
        height: 120px;
        padding: 0 0.875rem;
    }

    p {
        color: #d87c3c;
        text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
    }

    .line {
        border-top: 1px solid #d87c3c;
        width: 100%;
        position: absolute;
        top: 50;
        transform: translateY(-50%);
        z-index: 1;
    }

    .fav {
        color: #4c6c8a;
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
        padding: 0;
        margin: 0;
        transition: font-variation-settings 0.2s ease-in-out, color 0.2s;
    }

    .fav:hover {
        font-variation-settings: 
        'FILL' 1,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
        color: #d87c3c;
        cursor: pointer;
        text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);
    }

    .fav:active {
        transform: scale(0.95);
        color: #4c6c8a;
        transition: transform 0.1s, color 0.2s;
        font-variation-settings: 
        'FILL' 1,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
    }

    .fav.favorited {
        color: #d87c3c;
        font-variation-settings: 
        'FILL' 1,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
    }

    .fav.is-loading {
        opacity: 0.5;
        animation: spin 1s infinite linear;
        pointer-events: none;
    }
</style>