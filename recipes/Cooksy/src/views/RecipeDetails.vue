<template>
  <div class="max-w-4xl mx-auto py-8 px-6 text-slate-800 animate-fade-in-up" :style="pagePaddingStyle">
    <div v-if="isLoading" class="flex items-center justify-center gap-3 py-16 text-slate-500 font-medium text-lg">
        <span class="material-icons spin">autorenew</span>Loading recipe details...
    </div>

    <div v-else-if="recipeError" class="flex flex-col items-center justify-center gap-3 py-16 text-red-500 bg-red-50 rounded-2xl border border-red-100 max-w-xl mx-auto px-6 text-center">
        <span class="material-icons text-4xl">error_outline</span>
        <h3 class="font-bold text-lg">{{ recipeError }}</h3>
        <p class="text-sm text-slate-600">Could not load the recipe details. Please try again or go back.</p>
    </div>

    <div v-else-if="meal" class="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs recipe-content">
        <div class="flex flex-col md:flex-row gap-8 items-start mb-8 pb-8 border-b border-slate-100 relative recipe-header">
            <span
                class="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-slate-600 hover:text-red-500 select-none material-symbols-outlined fav z-10"
                :class="{
                    favorited: isFavorite,
                    'is-loading': isFavLoading
                }"
                @click="toggleFav"
                :style="{ cursor: isFavLoading ? 'wait' : 'pointer' }"
            >
                favorite
            </span>
            <img :src="meal.strMealThumb" :alt="meal.strMeal" class="w-full md:w-2/5 aspect-video md:aspect-square object-cover rounded-2xl shadow-xs border border-slate-100 recipe-image">
            <div class="flex-1 space-y-4 text-left header-info">
                <h1 class="text-2xl md:text-3xl font-extrabold text-brand-blue">{{ meal.strMeal }}</h1>
                <div class="flex flex-wrap gap-4 text-sm font-medium text-slate-600 recipe-meta">
                    <span class="flex items-center gap-1.5 meta-item">
                        <span class="material-icons text-brand-orange text-lg">category</span> {{ meal.strCategory }}
                    </span>
                    <span class="flex items-center gap-1.5 meta-item">
                        <span class="material-icons text-brand-orange text-lg">flag</span> {{ meal.strArea }}
                    </span>
                </div>
                <div class="text-xs flex flex-wrap items-center gap-2 text-slate-500 recipe-tags">
                    <span v-if="meal.strTags" class="flex flex-wrap items-center gap-1.5">
                        <span class="font-semibold text-slate-400 mr-1">Tags:</span>
                        <span v-for="tag in meal.strTags.split(',')" :key="tag" class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                            {{ tag.trim() }}
                        </span>
                    </span>
                </div>
                <a :href="meal.strYoutube" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer youtube-link" v-if="meal.strYoutube">
                    <span class="material-icons text-lg">play_circle</span> Watch on YouTube
                </a>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 pt-6 recipe-body">
            <div class="md:col-span-1 space-y-4 text-left ingredients-list">
                <h2 class="text-base font-extrabold text-brand-blue border-b border-slate-100 pb-2">Ingredients:</h2>
                <ul class="divide-y divide-slate-100">
                    <li v-for="({ ingredient, measure }, index) in ingredientsAndMeasures" :key="index" class="flex justify-between py-2 text-sm">
                        <span class="font-bold text-brand-orange measure">{{ measure }}</span>
                        <span class="text-slate-600 text-right pl-2 ingredient">{{ ingredient }}</span>
                    </li>
                </ul>
            </div>

            <div class="md:col-span-2 space-y-4 text-left instructions-section">
                <h2 class="text-base font-extrabold text-brand-blue border-b border-slate-100 pb-2">Instructions:</h2>
                <p class="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-line instructions" v-html="formattedInstructions"></p>
            </div>
        </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
        <span class="material-icons text-4xl">search_off</span>
        <p class="font-medium">Recipe not found.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/firebase';
import { useFav } from '../composables/useFav';

declare const __app_id: string;

interface MealDetail {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
    strInstructions: string;
    strTags: string | null;
    strYoutube: string | null;
    [key: string]: string | null;
}

interface IngredientPair {
    ingredient: string;
    measure: string;
}

export default defineComponent({
    name: 'RecipeDetails',
    props: {
        id: {
            type: String,
            required: true
        },

        navbarHeight: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    setup(props) {
        const route = useRoute();
        const meal = ref<MealDetail | null>(null);
        const isLoading = ref(false);
        const recipeError = ref<string | null>(null);

        const db = getFirebaseDb();
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'cooksy';

        const fetchRecipeDetails = async (id: string) => {
            if (!id) return;

            isLoading.value = true;
            recipeError.value = null;
            meal.value = null;

            try {
                const recipeDocRef = doc(
                    db,
                    'artifacts',
                    appId,
                    'public',
                    'data',
                    'recipes',
                    id
                );
                const docSnap = await getDoc(recipeDocRef);

                if (docSnap.exists()) {
                    meal.value = docSnap.data() as MealDetail;
                    isLoading.value = false;
                    return;
                }
            } catch (error) {
                console.warn('Recipe not found in Firestore, checking API...', error);
            }

            try {
                const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.meals && data.meals.length > 0) {
                    meal.value = data.meals[0] as MealDetail;
                } else {
                    recipeError.value = 'No recipe found with this ID.';
                }
            } catch (error) {
                console.error('Error fetching recipe details.', error);
                recipeError.value = 'Failed to fetch recipe details.'
            } finally {
                isLoading.value = false;
            }
        };

        watch(() => route.params.id, (newId) => {
            if (typeof newId === 'string' && newId) {
                fetchRecipeDetails(newId);
            }
        }, { immediate: true });

        const ingredientsAndMeasures = computed<IngredientPair[]>(() => {
            if (!meal.value) return [];

            const pairs: IngredientPair[] = [];

            for (let i = 1; i <= 20; i++) {
                const ingredientKey = `strIngredient${i}`;
                const measureKey = `strMeasure${i}`;

                const ingredient = meal.value[ingredientKey]?.trim();
                const measure = meal.value[measureKey]?.trim();

                if (!ingredient || ingredient === "") {
                    break;
                }

                pairs.push({
                    ingredient: ingredient,
                    measure: measure || 'a dash of'
                });
            }
            return pairs;
        });

        const formattedInstructions = computed(() => {
            if (!meal.value || !meal.value.strInstructions) return '';
            return meal.value.strInstructions.replace(/\r\n/g, '<br><br>');
        });

        const pagePaddingStyle = computed(() => ({
            paddingTop: `${props.navbarHeight + 40}px`,
        }));

        const {
            isFavorite,
            toggleFav,
            isLoading: isFavLoading
        } = useFav(props.id);

        const handleToggleFav = () => {
            toggleFav(props.id);
        };

        return {
            meal,
            isLoading,
            recipeError,
            pagePaddingStyle,
            ingredientsAndMeasures,
            formattedInstructions,
            isFavorite,
            isFavLoading,
            toggleFav: handleToggleFav,
        };
    },
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

    .spin {
        animation: spin 1.2s infinite linear;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>