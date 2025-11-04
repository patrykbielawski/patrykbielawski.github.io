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
        <RecipeCard
            v-for="meal in meals"
            :key="meal.idMeal"
            :recipe="meal"
        />
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

import RecipeCard from '../components/RecipeCard.vue';

export default defineComponent({
    name: 'SearchResults',
    components: {
        RecipeCard,
    },
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

    .search-results-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px !important;
        text-align: center;
        text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
    }

    .meal-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2em;
        justify-content: center;
    }

    .search-results-page h2 {
        color: #4c6c8a;
        margin-bottom: 30px;
        font-size: 2em;
        font-weight: 700;
    }

    .search-results-page p {
        color: #d87c3c;
    }

    strong {
        color: #4c6c8a;
    }

</style>