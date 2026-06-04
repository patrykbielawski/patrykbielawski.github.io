<template>
    <div class="meal-card flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-[300px] w-full">
        <div class="relative overflow-hidden aspect-video bg-slate-50">
            <router-link :to="`/recipe/${recipeId}`" class="block w-full h-full">
                <img :src="recipe.strMealThumb" :alt="recipe.strMeal" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">                
            </router-link>

            <span
                class="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-slate-500 hover:text-red-500 select-none material-symbols-outlined fav"
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

        <div class="p-4 flex-grow flex flex-col justify-between">
            <router-link :to="`/recipe/${recipeId}`" class="no-underline group">
                <h3 class="text-base font-bold text-slate-800 group-hover:text-brand-orange transition-colors duration-200 line-clamp-2 h-12 flex items-center justify-center">{{ recipe.strMeal }}</h3>
            </router-link>

            <div class="my-3 border-t border-slate-100"></div>

            <div class="text-xs space-y-1 mb-4 text-slate-600">
                <p><strong class="font-semibold text-brand-blue">Category:</strong> {{ recipe.strCategory }}</p>
                <p><strong class="font-semibold text-brand-blue">Area:</strong> {{ recipe.strArea }}</p>
            </div>

            <router-link :to="`/recipe/${recipeId}`" class="block w-full">
                <button class="w-full py-2 px-4 text-xs font-semibold rounded-lg bg-brand-orange text-white hover:bg-brand-orange-hover shadow-xs active:scale-95 transition-all cursor-pointer">View Recipe</button>
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
    .fav {
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
        transition: font-variation-settings 0.2s ease-in-out, color 0.2s, transform 0.1s;
    }

    .fav:hover {
        font-variation-settings: 
        'FILL' 1,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
        color: #ef4444;
    }

    .fav.favorited {
        color: #ef4444;
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

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>