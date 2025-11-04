import { getFirebaseDb } from "@/firebase";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc, type DocumentData } from "firebase/firestore";
import { ref, watch, type Ref } from "vue";
import { useCurrentUser } from "vuefire";

interface UseFav {
    isFavorite: Ref<boolean>;
    toggleFav: (recipeId: string) => Promise<void>;
    isLoading: Ref<boolean>;
}

export function useFav(recipeId: string): UseFav {
    const currentUser = useCurrentUser();
    const db = getFirebaseDb();

    const isFavorite = ref(false);
    const isLoading = ref(false);

    const userFavoritesRef: Ref<string[]> = ref([]);

    let unsubscribe: (() => void) | null = null;

    watch(currentUser, (newUser) => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }

        if (newUser) {
            const userDocRef = doc(db, 'users', newUser.uid);

            unsubscribe = onSnapshot(userDocRef, (DocumentSnapshot) => {
                const data = DocumentSnapshot.data() as DocumentData | undefined;

                const favorites = (data?.favoriteRecipeIds || []) as string[];

                userFavoritesRef.value = favorites;

                isFavorite.value = favorites.includes(recipeId);
            });
        } else {
            userFavoritesRef.value = [];
            isFavorite.value = false;
        }
    }, { immediate: true });

    const toggleFav = async (id: string) => {
        if (!currentUser.value) {
            alert('Please log in to save your favorite recipes!');
            return;
        }

        isLoading.value = true;
        const userDocRef = doc(db, 'users', currentUser.value.uid);

        try {
            const updateAction = isFavorite.value ? arrayRemove(id) : arrayUnion(id);

            await updateDoc(userDocRef, {
                favoriteRecipeIds: updateAction,
            });

        } catch (error) {
            console.error('Error toggling favorite status:', error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isFavorite,
        toggleFav,
        isLoading,
    };
}