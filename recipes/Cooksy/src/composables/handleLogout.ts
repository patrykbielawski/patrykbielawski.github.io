import { getFirebaseAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";

type SuccessCallback = () => void;

export function useLogout() {
    const router = useRouter();
    const currentUser = useCurrentUser();

    const handleLogout = async (onSuccess?: SuccessCallback) => {
        try {
            const authInstance = getFirebaseAuth();

            if (!authInstance) {
                console.error('Firebase Auth service is not available for sign out.');
                return;
            }

            await signOut(authInstance);

            if (onSuccess) {
                onSuccess();
            } else {
                alert('You have been successfully logged out!');
            }

            router.push({ name: 'Home' });
        
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const isLoggedIn = currentUser;

    return {
        currentUser,
        isLoggedIn,
        handleLogout,
    };
}