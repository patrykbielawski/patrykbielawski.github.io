<template>
  <div class="recipe-details-page" :style="pagePaddingStyle">
    <div v-if="isLoading" class="loading-message">
        <span class="material-icons spin">autorenew</span>Loading recipe details...
    </div>

    <div v-else-if="recipeError" class="error-message">
        <span class="material-icons">error-outline</span> {{ recipeError }}
        <p>Could not load the recipe details. Please try again or go back.</p>
    </div>

    <div v-else-if="meal" class="recipe-content">
        <div class="recipe-header">
            <span class="material-symbols-outlined fav" @click="toggleFav">favorite</span>
            <img :src="meal.strMealThumb" :alt="meal.strMeal" class="recipe-image">
            <div class="header-info">
                <h1>{{ meal.strMeal }}</h1>
                <div class="recipe-meta">
                    <span class="meta-item">
                        <span class="material-icons">category</span> {{ meal.strCategory }}
                    </span>
                    <span class="meta-item">
                        <span class="material-icons">flag</span> {{ meal.strArea }}
                    </span>
                </div>
                <p class="recipe-tags">
                    <span v-if="meal.strTags" class="tag-list">
                        Tags:
                        <span v-for="tag in meal.strTags.split(',')" :key="tag" class="tag">
                            {{ tag.trim() }}
                        </span>
                    </span>
                </p>
                <a :href="meal.strYoutube" target="_blank" class="youtube-link" v-if="meal.strYoutube">
                    <span class="material-icons">play_circle</span> Watch on YouTube
                </a>
            </div>
        </div>

        <div class="recipe-body">
            <div class="ingredients-list">
                <h2>Ingredients</h2>
                <ul>
                    <li v-for="({ ingredient, measure }, index) in ingredientsAndMeasures" :key="index">
                        <span class="measure">{{ measure }}</span>
                        <span class="ingredient">{{ ingredient }}</span>
                    </li>
                </ul>
            </div>

            <div class="instructions-section">
                <h2>Instructions</h2>
                <p class="instructions" v-html="formattedInstructions"></p>
            </div>
        </div>
    </div>

    <div v-else class="error-message">
        <span class="material-icons">search_off</span>Recipe not found.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

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

        const fetchRecipeDetails = async (id: string) => {
            if (!id) return;

            isLoading.value = true;
            recipeError.value = null;
            meal.value = null;

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

                if (!ingredient) {
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

        return {
            meal,
            isLoading,
            recipeError,
            pagePaddingStyle,
            ingredientsAndMeasures,
            formattedInstructions,
        };
    },
});
</script>

<style scoped>

    .recipe-details-page {
        max-width: 900px;
        min-height: calc(100vh - 150px);
        margin: 0 auto;
        padding: 30px 20px;
        font-family: Roboto, sans-serif;
        color: #333;
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
    }

    .loading-message, .error-message {
        text-align: center;
        padding: 50px;
        font-size: 1.2em;
        color: #555;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .recipe-content {
        background: #fff;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
    }

    .recipe-header {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #eee;
    }

    .recipe-image {
        width: 100%;
        max-height: 350px;
        object-fit: cover;
        border-radius: 6px;
        outline: 1px solid #4c6c8a;
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);
    }

    .header-info h1 {
        font-size: 2em;
        margin-top: 0;
        margin-bottom: 10px;
        color: #4c6c8a;
    }

    .recipe-meta {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
    }

    .meta-item {
        display: flex;
        align-items: center;
        font-size: 0.9em;
    }

    .meta-item .material-icons {
        margin-right: 5px;
        font-size: 1em;
        color: #d87c3c; /* Simple accent color */
    }

    .tag {
        display: inline-block;
        background-color: #f0f0f0;
        padding: 2px 8px;
        border-radius: 4px;
        margin-left: 5px;
        font-size: 0.8em;
    }

    .fav {
        display: flex;
        height: 1em;
        width: 1em;
        justify-content: flex-start;
        align-items: initial;
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

    .youtube-link {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 8px 15px;
        background-color: #ff0000;
        color: white;
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
    }

    .youtube-link:hover {
        transform: scale(1.05);
        background-color: #CD201F;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        transition: transform 0.2s ease-in-out;
    }

    .youtube-link:active {
        transform: scale(0.95);
        transition: transform 0.2s ease-in-out;
    }

    .recipe-body {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
        background-color: #fff;
    }

    .recipe-body h2 {
        color: #333;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.5em;
    }

    /* Ingredients */
    .ingredients-list ul {
        list-style: none;
        padding: 0;
    }

    .ingredients-list li {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #4c6c8a;
        font-size: 1em;
    }

    .measure {
        font-weight: bold;
        flex-basis: 35%;
        text-align: left;
    }

    .ingredient {
        flex-basis: 65%;
        text-align: center;
        border-left: 1px solid #4c6c8a;
    }

    /* Instructions */
    .instructions-section {
        line-height: 1.6;
        text-align: center;
    }

    /* Responsive adjustments */
    @media (min-width: 768px) {
        .recipe-header {
            flex-direction: row;
        }
        
        .recipe-image {
            width: 40%;
            max-width: 300px;
            flex-shrink: 0;
        }

        .recipe-body {
            grid-template-columns: 1fr 2fr;
        }
    }

</style>