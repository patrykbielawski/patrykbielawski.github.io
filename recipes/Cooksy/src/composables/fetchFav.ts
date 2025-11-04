import { getFirebaseDb } from "@/firebase";
import { ref, watch, } from 'vue';
import type { Ref } from "vue";
import { useCurrentUser } from "vuefire";
import { fetchRecipeById } from "./recipeId";
import { onSnapshot, doc, type DocumentData } from "firebase/firestore";

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string | null;
    strArea: string | null;
}

declare const __app_id: string;

export function fetchFavorite() {
    const currentUser = useCurrentUser();
    const db = getFirebaseDb();

    const favoriteRecipes: Ref<Meal[]> = ref([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    let unsubscribe: (() => void) | null = null;

    const fetchRecipeDetails = async (ids: string[]) => {
        if (ids.length === 0) {
            favoriteRecipes.value = [];
            isLoading.value = false;
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const promises = ids.map(id => fetchRecipeById(id));
            const results = await Promise.all(promises);

            favoriteRecipes.value = results.filter((meal): meal is Meal => meal !== null);

        } catch (e) {
            console.error("Failed to fetch favorite recipes details:", e);
            error.value = "Failed to load recipe details.";
        } finally {
            isLoading.value = false;
        }
    };

    watch(currentUser, (newUser) => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }

        favoriteRecipes.value = [];
        isLoading.value = true;
        error.value = null;

        if (newUser) {
            const userDocRef = doc(db, 'users', newUser.uid);

            unsubscribe = onSnapshot(userDocRef, (DocumentSnapshot) => {
                const data = DocumentSnapshot.data() as DocumentData | undefined;

                const favorites = (data?.favoriteRecipeIds || []) as string[];

                fetchRecipeDetails(favorites);
            }, (err) => {
                console.error("Firestore subscription error:", err);
                error.value = "Failed to synchronize favorites list.";
                isLoading.value = false;
            });
        } else {
            isLoading.value = false;
        }
    }, { immediate: true });

    return {
        favoriteRecipes,
        isLoading,
        error,
    };
}