<template>
  <div class="max-w-6xl mx-auto py-8 px-4 text-slate-850 animate-fade-in-up" :style="pagePaddingStyle">
    <h2 class="text-xl md:text-2xl font-extrabold text-brand-blue mb-8">
        <span v-if="!isLoading && !searchError && meals">
            Showing {{ meals.length }} Result{{ meals.length === 1 ? '' : 's' }} for:
        </span>
        <span v-else-if="currentQuery" class="text-slate-500 font-medium">Searching for: </span>
        <span class="text-brand-orange">"{{ currentQuery }}"</span>
    </h2>

    <p v-if="isLoading" class="flex items-center justify-center gap-2 py-16 text-slate-500 font-medium text-lg">
        <span class="material-icons spin animate-spin">autorenew</span> Fetching delicious recipes...
    </p>

    <div v-else-if="searchError" class="flex flex-col items-center justify-center gap-3 py-16 text-red-500 bg-red-50 rounded-2xl border border-red-100 max-w-xl mx-auto px-6 text-center">
        <span class="material-icons text-3xl">error_outline</span>
        <h3 class="font-bold text-lg">{{ searchError }}</h3>
        <p class="text-sm text-slate-600">Please try a different search term or check your internet connection.</p>
    </div>

    <div v-else-if="meals && meals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        <RecipeCard
            v-for="meal in meals"
            :key="meal.idMeal"
            :recipe="meal"
        />
    </div>

    <div v-else class="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 max-w-md mx-auto text-center">
        <span class="material-icons text-5xl text-slate-350">search_off</span>
        <p class="text-base font-semibold text-slate-800">Sorry, we couldn't find any recipes matching "{{ currentQuery }}"</p>
        <p class="text-xs text-slate-500 leading-relaxed">Try searching by a category (e.g., 'Italian'), or a single letter (e.g., 'C')</p>
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
</style>