<template>
    <div class="max-w-3xl mx-auto py-10 px-6 animate-fade-in-up text-slate-800">
        <h2 class="text-2xl md:text-3xl font-extrabold text-brand-blue mb-1">Submit Your Recipe</h2>
        <p class="text-sm md:text-base text-slate-500 mb-8 font-medium">Help our community grow by sharing your own culinary masterpiece!</p>

        <div class="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col justify-center">

            <p v-if="submitError" class="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl flex items-center gap-2 mb-6">
                <span class="material-icons text-sm">error_outline</span> {{ submitError }}
            </p>
            <p v-if="submitSuccess" class="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2.5 rounded-xl flex items-center gap-2 mb-6">
                <span class="material-icons text-sm">check_circle</span> {{ submitSuccess }}
            </p>

            <form @submit.prevent="addRecipe" class="w-full space-y-6">

                <div class="flex flex-col text-left space-y-1.5">
                    <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipe Preview (Generated):</label>
                    <div class="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-xs bg-slate-50">
                        <div v-if="isImageLoading" class="w-full aspect-video flex flex-col items-center justify-center text-slate-400 text-xs gap-2 py-8">
                            <span class="material-icons spin animate-spin text-2xl text-brand-orange">sync</span>
                            <span>Finding the perfect photo...</span>
                        </div>
                        <div v-else-if="reactivePreviewUrl" class="relative group">
                            <img 
                                :src="reactivePreviewUrl"
                                :key="reactivePreviewUrl"
                                alt="Generated Image Preview"
                                class="w-full aspect-video object-cover"
                            >
                            <p class="text-[10px] text-slate-400 px-3 py-2 bg-slate-50/90 border-t border-slate-100">An image generated automatically based on your recipe's name.</p>
                        </div>
                        <div v-else class="w-full aspect-video flex flex-col items-center justify-center text-slate-400 text-xs gap-2 py-8">
                            <span class="material-icons text-3xl">restaurant</span>
                            <span>Start typing a name to see a preview...</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col text-left space-y-1.5">
                    <label for="name" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your recipe's name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        v-model="form.name"
                        required
                        placeholder="What's the name of your dish?"
                        autocomplete="name"
                        class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                    >
                </div>

                <div class="flex flex-col text-left space-y-1.5">
                    <div v-if="categoryLoading" class="flex items-center gap-2 text-slate-500 text-xs italic py-2">
                        <span class="font-semibold text-slate-400 mr-1">Category:</span>
                        <span class="material-icons spin animate-spin text-sm">autorenew</span> Loading categories...
                    </div>
                    <template v-else>
                        <label for="category" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                        <select 
                            v-model="form.category"
                            required
                            id="category"
                            name="category"
                            autocomplete="off"
                            class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400 cursor-pointer"
                        >
                            <option value="" disabled>Select a Category</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                    </template>
                    <p v-if="categoryError" class="text-xs font-semibold text-red-500 py-1">{{ categoryError }}</p>
                </div>

                <div class="flex flex-col text-left space-y-1.5">
                    <div v-if="areaLoading" class="flex items-center gap-2 text-slate-500 text-xs italic py-2">
                        <span class="font-semibold text-slate-400 mr-1">Area:</span>
                        <span class="material-icons spin animate-spin text-sm">autorenew</span> Loading Areas...
                    </div>
                    <template v-else>
                        <label for="area" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Area</label>
                        <select
                            v-model="form.area"
                            required
                            name="area"
                            id="area"
                            autocomplete="off"
                            class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400 cursor-pointer"
                        >
                            <option value="" disabled>Select a Cuisine Area</option>
                            <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
                        </select>
                    </template>
                    <p v-if="areaError" class="text-xs font-semibold text-red-500 py-1">{{ areaError }}</p>
                </div>

                <div class="flex flex-col text-left space-y-1.5">
                    <label for="tags" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags (Comma-separated)</label>
                    <input 
                        id="tags"
                        name="tags"
                        type="text"
                        v-model="form.tags"
                        placeholder="e.g., Quick, Dinner, Healthy"
                        autocomplete="off"
                        class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                    >
                </div>

                <div class="flex flex-col text-left space-y-1.5">
                    <label for="source" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Source/Website (Optional)</label>
                    <input 
                        id="source"
                        name="source"
                        type="url"
                        v-model="form.source"
                        placeholder="Original recipe source link"
                        autocomplete="off"
                        class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                    >
                </div>

                <div class="flex flex-col text-left space-y-1.5">
                    <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingredients (min 1)</span>
                    <div class="space-y-3">
                        <div 
                            v-for="(ingredient, index) in form.ingredients" 
                            :key="index" 
                            class="flex flex-col md:flex-row items-center gap-3 w-full"
                        >
                            <label :for="`ingredient-${index}`" class="sr-only">Ingredient #{{ index + 1 }}</label>
                            <input
                                :id="`ingredient-${index}`"
                                :name="`ingredient-${index}`"
                                type="text"
                                v-model="ingredient.name"
                                placeholder="Ingredient (e.g., Flour, Sugar)"
                                required
                                class="flex-grow w-full md:w-auto px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                            >
                            <label :for="`measure-${index}`" class="sr-only">Ingredient Measurement {{ index + 1 }}</label>
                            <input
                                :id="`measure-${index}`"
                                :name="`measure-${index}`" 
                                type="text"
                                v-model="ingredient.measure"
                                placeholder="Measure (e.g., 1 cup, 2 tbsp)"
                                required
                                class="flex-grow w-full md:w-auto px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                            >
                            <button
                                type="button"
                                @click="removeIngredient(index)"
                                :disabled="form.ingredients.length === 1"
                                :title="form.ingredients.length === 1 ? 'Must have at least one ingredient' : 'Remove Ingredient'"
                                class="text-red-500 hover:text-red-655 disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none cursor-pointer flex items-center justify-center p-2"
                            >
                                <span class="material-icons text-2xl">remove_circle_outline</span>
                            </button>
                        </div>
                    </div>
                    <button type="button" @click="addIngredient" class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-blue text-white hover:bg-slate-700 transition-all duration-200 active:scale-95 cursor-pointer w-auto self-start mt-3">
                        <span class="material-icons text-sm">add_circle_outline</span> Add Ingredient
                    </button>
                </div>

                <div class="flex flex-col text-left space-y-1.5">
                    <label for="instructions" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instructions</label>
                    <textarea 
                        id="instructions"
                        name="instructions"
                        v-model="form.instructions"
                        required 
                        placeholder="Write clear, step-by-step instructions for your recipe."
                        autocomplete="off"
                        rows="8"
                        class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400 resize-y"
                    >
                    </textarea>
                </div>

                <div class="pt-6">
                    <button type="submit" :disabled="isSubmitting" class="w-full md:w-56 py-3 px-6 text-sm font-semibold rounded-xl bg-brand-orange text-white hover:bg-brand-orange-hover shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mx-auto">
                        {{ isSubmitting ? 'Submitting...' : 'Submit Recipe' }}
                    </button>
                </div>

            </form>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch, } from "vue";
import { fetchCategories, fetchAreas } from '../composables/mealDbApi';

import { collection, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';
import { useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";

interface RecipeIngredient {
    name: string;
    measure: string;
}

interface FormState {
    name: string;
    category: string;
    area: string;
    tags: string;
    source: string;
    ingredients: RecipeIngredient[];
    instructions: string;
    imageFile: File | null;
}

declare const __app_id: string;

export default defineComponent({
    name: 'SubmitRecipe',

    setup() {
        const router = useRouter();
        const user = useCurrentUser();
        const db = getFirebaseDb();
        const auth = getFirebaseAuth();
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'cooksy';

        const form = reactive<FormState>({
            name: '',
            category: '',
            area: '',
            tags: '',
            source: '',
            instructions: '',
            ingredients: [{ name: '', measure: ''}],
            imageFile: null,
        });

        const isSubmitting = ref(false);
        const submitError = ref('');
        const submitSuccess = ref('');

        const categories = ref<string[]>([]);
        const categoryLoading = ref(true);
        const categoryError = ref<string |null>(null);

        const areas = ref<string[]>([]);
        const areaLoading = ref(true);
        const areaError = ref<string |null>(null);

        const addIngredient = () => {
            form.ingredients.push({ name: '', measure: '' });
        };

        const removeIngredient = (index: number) => {
            if (form.ingredients.length > 1) {
                form.ingredients.splice(index, 1);
            }
        };

        const loadLists = async () => {
            categoryLoading.value = true;
            categoryError.value = null;
            try {
                categories.value = await fetchCategories();
                if (categories.value.length === 0) {
                    categoryError.value = 'Could not load categories. Please try again.'
                }
            } catch (e) {
                console.error('Category fetch error:', e);
                categoryError.value = 'Failed to load categories from API.';
            } finally {
                categoryLoading.value = false;
            }

            areaLoading.value = true;
            areaError.value = null;
            try {
                areas.value = await fetchAreas();
                if (areas.value.length === 0) {
                    areaError.value = 'Could not load cuisine areas. Please try again.'
                }
            } catch (e) {
                console.error('Area fetch error:', e);
                areaError.value = 'Failed to load cuisine areas from API.';
            } finally {
                areaLoading.value = false;
            }
        };

        const reactivePreviewUrl = ref<string | null>(null);
        const isImageLoading = ref(false);

        const updateRecipeImage = async (query: string) => {
            if (!query || query.length < 3) {
                reactivePreviewUrl.value = null;
                return;
            }

            isImageLoading.value = true;
            try {
                const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
                const searchTerms = encodeURIComponent(`${query} ${form.category} food plated`);
                const res = await fetch(
                    `https://api.unsplash.com/search/photos?query=${searchTerms}&per_page=1&orientation=landscape`,
                    {
                        headers: {
                            Authorization: `Client-ID ${accessKey}`
                        }
                    }
                );

                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    reactivePreviewUrl.value = data.results[0].urls.regular;
                }
            } catch (error) {
                console.error('Unsplash API error:', error);
                reactivePreviewUrl.value = `https://loremflickr.com/800/600/${encodeURIComponent(query)},food`;
            } finally {
                isImageLoading.value = false;
            }
        };

        watch([() => form.name, () => form.category], ([newName]) => {
            const handler = setTimeout(() => {
                updateRecipeImage(newName);
            }, 800);

            return () => clearTimeout(handler);
        });

        const addRecipe = async () => {

            if (!user.value) {
                submitError.value = 'You must be logged in to submit a recipe.';
                return;
            }
            
            if (isSubmitting.value) return;

            isSubmitting.value = true;
            submitError.value = '';
            submitSuccess.value = '';

            try {
                const recipeId = crypto.randomUUID();

                const ingredientsMap = form.ingredients.reduce((acc, ing, index) => {
                    const measureKey = `strMeasure${index + 1}`;
                    const ingredientKey = `strIngredient${index + 1}`;
                    (acc as any)[measureKey] = ing.measure;
                    (acc as any)[ingredientKey] = ing.name;
                    return acc;
                }, {});

                const recipeData = {
                    idMeal: recipeId,
                    strMeal: form.name,
                    strMealThumb: reactivePreviewUrl.value,
                    strCategory: form.category,
                    strArea: form.area,
                    strInstructions: form.instructions,
                    strTags: 'UserSubmitted',
                    strSource: 'Cooksy Community',
                    userId: user.value.uid,
                    userName: user.value.displayName,
                    createdAt: serverTimestamp(),
                    ...ingredientsMap
                };

                const recipeDocRef = doc(
                    db,
                    'artifacts',
                    appId,
                    'public',
                    'data',
                    'recipes',
                    recipeId
                );
                await setDoc(recipeDocRef, recipeData);

                submitSuccess.value = 'Recipe submitted successfully! Redirecting you in a moment...';

                form.name = '';
                form.category = '';
                form.area = '';
                form.instructions = '';
                form.ingredients = [{ name: '', measure: '' }];

                setTimeout(() => {
                    router.push({ name: 'Home' });
                }, 2000);

            } catch (e) {
                console.error('Error submitting recipe:', e);
                submitError.value = 'An error occurred while submitting your recipe. Please try again.';
            } finally {
                isSubmitting.value = false;
            }
        };

        onMounted(() => {
            loadLists();
        })

        return {
            form,
            categories,
            categoryLoading,
            categoryError,
            areas,
            areaLoading,
            areaError,
            isSubmitting,
            submitError,
            submitSuccess,
            addIngredient,
            removeIngredient,
            addRecipe,
            reactivePreviewUrl,
            isImageLoading,
        };
    },

});
</script>

<style scoped>
    .spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>