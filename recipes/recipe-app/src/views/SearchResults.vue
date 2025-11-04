<template>
  <div class="search-results-page" :style="pagePaddingStyle">
    <h2>
        <span v-if="!isLoading && !searchError && meals">
            Showing {{ meals.length }} Result{{ meals.length === 1 ? '' : 's' }} for:
        </span>
        <span v-else-if="currentQuery">Searching for: </span>
        "{{ currentQuery }}"
    </h2>

    <p v-if="isLoading" class="loading-message">
        <span class="material-icons spin">autorenew</span> Fetching delicious recipes...
    </p>

    <div v-else-if="searchError" class="error-message">
        <span class="material-icons">errour-outline</span> {{ searchError }}
        <p>Please try a different search term or check your internet connection.</p>
    </div>

    <div v-else-if="meals && meals.length > 0" class="meal-results-grid">
        <div v-for="meal in meals" :key="meal.idMeal" class="meal-card">
            <div class="card-image-container">
                <img :src="meal.strMealThumb" :alt="meal.strMeal" class="meal-thumb">
                <span class="material-symbols-outlined fav" @click="toggleFav">favorite</span>
            </div>
            <div class="card-content">
                <h3>{{ meal.strMeal }}</h3>
                <p><strong>Category:</strong> {{ meal.strCategory }}</p>
                <p><strong>Area:</strong> {{ meal.strArea }}</p>
                <button class="view-recipe-btn" @click="viewRecipe(meal.idMeal)">View Recipe</button>
            </div>
        </div>
    </div>

    <div v-else class="no-reults-message">
        <span class="material-icons">search_off</span>
        <p>Sorry, we couldn't find any recipes matching "{{ currentQuery }}"</p>
        <p>Try searching by a category (e.g., 'Italian'), or a single letter (e.g., 'C')</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchMeals, type Meal } from '../composables/useMealDB';
export default defineComponent({
    name: 'SearchResults',
    props: {
        navbarHeight: {
            type: Number,
            required: true,
            default: 0
        },
    },
    setup(props) {
        const route = useRoute();
        const router = useRouter();
        const meals = ref<Meal[] | null>(null);
        const isLoading = ref(false);
        const searchError = ref<string | null>(null);
        const currentQuery = ref('');

        const pagePaddingStyle = computed(() => ({
            paddingTop: `${props.navbarHeight + 40}px`,
            paddingBottom: '40px',
            minHeight: `calc(100vh - ${props.navbarHeight}px)`,
        }));

        const fetchResults = async (query: string) => {
            if (!query) {
                meals.value = [];
                currentQuery.value = '';
                return;
            }

            currentQuery.value = query;
            isLoading.value = true;
            searchError.value = null;

            try {
                meals.value = await searchMeals(query);
            } catch (e) {
                console.error('Search failed in component:', e);
                meals.value = null;
                
                if (e instanceof Error) {
                    searchError.value = e.message;
                } else {
                    searchError.value = 'An unknown error occurred during search.';
                }
            } finally {
                isLoading.value = false;
            }
        };

        watch(() => route.query.q, (newQuery) => {
            let queryToFetch = '';

            if (typeof newQuery === 'string' && newQuery !== null) {
                queryToFetch = newQuery;
            } else if (Array.isArray(newQuery) && newQuery.length > 0 ) {
                const firstValue = newQuery[0];
                if (typeof firstValue === 'string' && firstValue !== null) {
                    queryToFetch = firstValue;
                }
            }

            if (queryToFetch) {
                fetchResults(queryToFetch);
            } else {
                meals.value = [];
                currentQuery.value = '';
            }
        }, { immediate: true });

        const viewRecipe = (id: string) => {
            console.log(`Navigating to recipe details for ID: ${id}`);
            router.push({ path: `/recipe/${id}` });
        };

        return {
            meals,
            isLoading,
            searchError,
            currentQuery,
            pagePaddingStyle,
            viewRecipe,
        };
    },
});
</script>

<style scoped>

    .material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 200,
    'opsz' 48;
    }

    .fav {
        color: #4c6c8a;
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
        transition: font-variation-settings 0.2s ease-in-out, transform 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    .fav:hover {
        font-variation-settings: 
        'FILL' 1,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
        color: #d87c3c;
        transition: color 0.2s;
        cursor: pointer;
    }

    .fav:active {
        transform: scale(0.95);
        transition: transform 0.1s;
        color: #4c6c8a;
        font-variation-settings: 
        'FILL' 1,
        'wght' 400,
        'GRAD' 200,
        'opsz' 48;
    }

    .search-results-page {
        max-width: 1200px;
        margin: 0 auto;
        padding-left: 20px;
        padding-right: 20px;
        text-align: center;
    }

    .meal-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2em;
        justify-content: center;
    }

    .meal-card {
        box-shadow: 1px 1px 6px #4c6c8aBF;
        border-radius: 1em;
        padding: 10px;
        display: flex;
        flex-direction: column;
        text-align: center;
        height: auto;
    }

    .meal-card button {
        width: 60%;
    }

    .meal-thumb {
        height: auto;
        width: 100%;
        border-radius: 1em;
    }

    .search-results-page h2 {
        color: #4c6c8a;
        margin-bottom: 30px;
        font-size: 2em;
        font-weight: 700;
    }

    .search-results-page h3,
    .search-results-page p {
        color: #4c6c8a;
    }

</style>