import { ref, watch, onMounted} from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '@/firebase';

declare const __app_id: string;

export function fetchUserRecipes(userRef: any) {
    const userRecipes = ref<any[]>([]);
    const isRecipesLoading = ref(true);
    const recipesError = ref<string | null>(null);

    const fetchRecipes = async () => {
        if (!userRef.value?.uid) return;

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'cooksy';

        try {
            const db = getFirebaseDb();
            const recipesRef = collection(db, 'artifacts', appId, 'public', 'data', 'recipes');
            const q = query(recipesRef, where('userId', "==", userRef.value.uid));
            const querySnapshot = await getDocs(q);

            console.log('Current appId:', appId);
            console.log('Fetching for UID:', userRef.value.uid);

            userRecipes.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (err: any) {
            recipesError.value = err.message;
        } finally {
            isRecipesLoading.value = false;
        }
    };

    watch(() => userRef.value?.uid, (newUid) => {
        if (newUid) fetchRecipes();
    }, { immediate: true });

    return {
        userRecipes,
        isRecipesLoading,
        recipesError,
    };
}