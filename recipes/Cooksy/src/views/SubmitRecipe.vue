<template>
    <div class="submit-page">
        <h2>Submit Your Recipe</h2>
        <p>Help our community grow by sharing your own culinary masterpiece!</p>

        <div class="form-container">

            <p v-if="submitError" class="error-message">
                <span class="material-icons">error_outline</span> {{ submitError }}
            </p>
            <p v-if="submitSuccess" class="success-message">
                <span class="material-icons">check_circle</span> {{ submitSuccess }}
            </p>

            <form @submit.prevent="addRecipe" class="form">

                <div class="form-group image-upload-group">
                    <label for="imageFile">Photo of your dish:</label>
                    <input 
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        accept="image/*"
                        @change="handleImageUpload"
                        required
                        class="file-input"
                    >
                    <div v-if="imagePreviewUrl" class="image-preview">
                        <img :src="imagePreviewUrl" alt="Recipe Preview" class="preview-img">
                    </div>
                    <div v-else class="image-placeholder">
                        <span class="material-icons">image</span>
                        <span>Preview will appear here</span>
                    </div>
                    <p class="file-limit">Maximum file size: 5MB.</p>
                </div>

                <div class="form-group">
                    <label for="name">Your recipe's name:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        v-model="form.name"
                        required
                        placeholder="What's the name of your dish?"
                        autocomplete="name"
                    >
                </div>

                <div class="form-group">
                    <div v-if="categoryLoading" class="loading-message">
                        <span class="group-label">Category:</span>
                        <span class="material-icons spin">autorenew</span> Loading categories...
                    </div>
                    <template v-else>
                        <label for="category">Category:</label>
                        <select 
                            v-model="form.category"
                            required
                            id="category"
                            name="category"
                            autocomplete="off"
                        >
                            <option value="" disabled>Select a Category</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                    </template>
                    <p v-if="categoryError" class="error-message">{{ categoryError }}</p>
                </div>

                <div class="form-group">
                    <div v-if="areaLoading" class="loading-message">
                        <span class="group-label">Area:</span>
                        <span class="material-icons spin">autorenew</span> Loading Areas...
                    </div>
                    <template v-else>
                    <label for="area">Area:</label>
                        <select
                            v-model="form.area"
                            required
                            name="area"
                            id="area"
                            autocomplete="off"
                        >
                            <option value="" disabled>Select a Cuisine Area</option>
                            <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
                        </select>
                    </template>
                    <p v-if="areaError" class="error-message">{{ areaError }}</p>
                </div>

                <div class="form-group">
                    <label for="tags">Tags (Comma-separated):</label>
                    <input 
                        id="tags"
                        name="tags"
                        type="text"
                        v-model="form.tags"
                        placeholder="e.g., Quick, Dinner, Healthy"
                        autocomplete="off"
                    >
                </div>

                <div class="form-group">
                    <label for="source">Source/Website (Optional):</label>
                    <input 
                        id="source"
                        name="source"
                        type="url"
                        v-model="form.source"
                        placeholder="Original recipe source link"
                        autocomplete="off"
                    >
                </div>

                <div class="form-group ingredients-group">
                    <span class="group-label">Ingredients (min 1):</span>
                    <div 
                        v-for="(ingredient, index) in form.ingredients" 
                        :key="index" 
                        class="ingredient-input-row"
                    >
                        <label :for="`ingredient-${index}`" class="sr-only">Ingredient #{{ index + 1 }}</label>
                        <input
                            :id="`ingredient-${index}`"
                            :name="`ingredient-${index}`"
                            type="text"
                            v-model="ingredient.name"
                            placeholder="Ingredient (e.g., Flour, Sugar)"
                            required
                        >
                        <label :for="`measure-${index}`" class="sr-only">Ingredient Measurement {{ index + 1 }}</label>
                        <input
                            :id="`measure-${index}`"
                            :name="`measure-${index}`" 
                            type="text"
                            v-model="ingredient.measure"
                            placeholder="Measure (e.g., 1 cup, 2 tbsp)"
                            required
                        >
                        <button
                            type="button"
                            @click="removeIngredient(index)"
                            class="remove-button"
                            :disabled="form.ingredients.length === 1"
                            :title="form.ingredients.length === 1 ? 'Must have at least one ingredient' : 'Remove Ingredient'"
                        >
                            <span class="material-icons">remove_circle_outline</span>
                        </button>
                    </div>
                    <button type="button" @click="addIngredient" class="add-button">
                        <span class="material-icons">add_circle_outline</span> Add Ingredient
                    </button>
                </div>

                <div class="form-group">
                    <label for="instructions">Instructions:</label>
                    <textarea 
                        id="instructions"
                        name="instructions"
                        v-model="form.instructions"
                        required 
                        placeholder="Write clear, step-by-step instructions for your recipe."
                        autocomplete="off"
                        rows="8"
                    >
                    </textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" :disabled="isSubmitting" class="submit-btn">
                        {{ isSubmitting ? 'Submitting...' : 'Submit Recipe' }}
                    </button>
                </div>

            </form>

        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { fetchCategories, fetchAreas } from '../composables/mealDbApi';

import { collection, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
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
        const storage = getStorage();
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

        const selectedImageFile = ref<File | null>(null);
        const imagePreviewUrl = ref<string | null>(null);

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

        const handleImageUpload = (event: Event) => {
            const input = event.target as HTMLInputElement;
            submitError.value = '';

            if (input.files && input.files[0]) {
                const file = input.files[0];
                const maxSizeInMB = 5;

                if (!file.type.startsWith('image/')) {
                    submitError.value = 'Please select a valid image file (JPEG, PNG, GIF, etc.).';
                    input.value = '';
                    selectedImageFile.value = null;
                    imagePreviewUrl.value = null;
                    return;
                }

                if (file.size > maxSizeInMB * 1024 * 1024) {
                    submitError.value = `The file size must be less than ${maxSizeInMB}MB.`;
                    input.value = '';
                    selectedImageFile.value = null;
                    imagePreviewUrl.value = null;
                    return;
                }

                form.imageFile = file;
                imagePreviewUrl.value = URL.createObjectURL(file);
            } else {
                form.imageFile = null;
                imagePreviewUrl.value = null;
            }
        };

        const addRecipe = async () => {

            if (isSubmitting.value || !user.value || !form.imageFile) return;

            isSubmitting.value = true;
            submitError.value = '';
            submitSuccess.value = '';

            try {
                const imageFile = form.imageFile as File;
                const path = `user_recipes/${user.value.uid}/${Date.now()}_${imageFile.name}`;
                const storageReference = storageRef(storage, path);

                const uploadResult = await uploadBytes(storageReference, imageFile, {
                    contentType: imageFile.type,
                });
                const imageUrl = await getDownloadURL(uploadResult.ref);

                const ingredientsMap = form.ingredients.reduce((acc, ing, index) => {
                    const measureKey = `strMeasure${index + 1}`;
                    const ingredientKey = `strIngredient${index + 1}`;
                    (acc as any)[measureKey] = ing.measure;
                    (acc as any)[ingredientKey] = ing.name;
                    return acc;
                }, {});

                const recipeData = {
                    idMeal: crypto.randomUUID(),
                    strMeal: form.name,
                    strMealThumb: imageUrl,
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

                const recipesCollection = collection(db, 'artifacts', typeof __app_id !== 'undefined' ? __app_id : 'cooksy', 'public', 'data', 'recipes');
                await addDoc(recipesCollection, recipeData);

                submitSuccess.value = 'Recipe submitted successfully! Redirecting you in a moment...';

                form.name = '';
                form.category = '';
                form.area = '';
                form.instructions = '';
                form.ingredients = [{ name: '', measure: '' }];
                selectedImageFile.value = null;
                imagePreviewUrl.value = null;

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
            imagePreviewUrl,
            handleImageUpload,
        };
    },

});
</script>

<style scoped>

    .submit-page {
        padding: 40px 20px;
        min-height: 80vh;
        background-color: #f7f7f7;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .form-container {
        max-width: 900px;
        width: 80%;
        padding: 30px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
    }

    .form h3 {
        margin-top: 25px;
        margin-bottom: 15px;
        color: #4c6c8a;
        font-size: 1.5rem;
        border-bottom: 2px solid #d87c3c;
        padding-bottom: 5px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label,
    .group-label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        color: #4c6c8a;
    }

    input[type="text"],
    input[type="url"],
    select,
    textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-sizing: border-box;
        font-size: 16px;
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    input:focus,
    select:focus,
    textarea:focus {
        border-color: #d87c3c;
        box-shadow: 0 0 5px rgba(216, 124, 60, 0.5);
        outline: none;
    }

    select {
        appearance: none; 
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234c6c8a' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px top 50%;
        background-size: 18px;
        width: 60%;
        cursor: pointer;
    }

    textarea {
        resize: vertical;
    }

    .loading-message {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #4c6c8a;
        font-style: italic;
    }

    .error-message {
        color: #e74c3c;
        font-weight: bold;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #fceae8;
        border-left: 5px solid #e74c3c;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .success-message {
        color: #27ae60;
        font-weight: bold;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #e8fcf0;
        border-left: 5px solid #27ae60;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .success-message .material-icons,
    .error-message .material-icons {
        font-size: 20px;
    }

    .form-actions {
        text-align: center;
        margin-top: 30px;
    }

    button {
        background-color: #d87c3c;
        color: white;
        padding: 12px 25px;
        outline: 1px solid #4c6c8a;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
        background-color: #4c6c8a;
        outline: 1px solid #d87c3c;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    }

    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .submit-btn {
        width: 200px;
    }

    .spin {
        animation: spin 1s linear infinite;
        vertical-align: middle;
        margin-right: 5px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .ingredient-input-row {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;
        align-items: center;
    }

    .ingredient-input-row input {
        flex-grow: 1;
    }

    .remove-button {
        background: none;
        border: none;
        outline: none;
        padding: 0;
        margin: 0;
        width: auto;
        transition: none;
        color: #e74c3c;
        cursor: pointer;
    }

    .remove-button:disabled {
        color: #333;
        background: none;
        cursor: not-allowed;
        opacity: 0.7;
    }

    .remove-button:hover:not(:disabled) {
        color: #c0392b;
        background: none;
        box-shadow: none;
        outline: none;
    }

    .remove-button .material-icons {
        font-size: 28px;
        vertical-align: middle;
    }

    .add-button {
        background-color: #4c6c8a;
        color: #f7f7f7;
        outline: 1px solid #d87c3c;
        font-size: 16px;
        padding: 8px 15px;
        margin-top: 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        gap: 5px;
        width: auto;
    }

    .add-button .material-icons {
        font-size: 20px;
    }

    .add-button:hover:not(:disabled) {
        background-color: #384f67;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .submit-btn {
        width: 100%;
        padding: 15px;
        font-size: 1.2rem;
        font-weight: bold;
        background-color: #d87c3c;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 25px;
        transition: background-color 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .submit-btn:hover:not(:disabled) {
        background-color: #c96e30;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .submit-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .image-upload-group {
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
    }

    .file-input {
        border: none;
        padding: 0;
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .file-limit {
        margin-top: 0.25rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #6B7280;
    }

    .image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 150px;
        background-color: #eee;
        border-radius: 8px;
        color: #999;
    }

    .image-placeholder .material-icons {
        font-size: 3rem;
        margin-bottom: 5px;
    }

    .image-preview {
        margin-top: 10px;
        max-height: 250px;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .preview-img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
    }

    @media only screen and (min-width: 768px) {
        .ingredient-input-row {
            flex-direction: row;
        }
    }

</style>