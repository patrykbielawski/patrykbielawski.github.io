<template>
    <div class="w-full flex flex-col items-center p-2 bg-white">
        <form class="w-full space-y-4" @submit.prevent="handleSignup">
            
            <div class="flex flex-col text-left space-y-1.5">
                <label for="display-name" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Name</label>
                <input
                    id="display-name" 
                    type="text"
                    v-model="displayName"
                    required
                    autocomplete="name"
                    placeholder="Your Name or Nickname"
                    class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                >
            </div>

            <div class="flex flex-col text-left space-y-1.5">
                <label for="email" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                    id="email"
                    type="email"
                    v-model="email"
                    required
                    autocomplete="email"
                    placeholder="john@example.com"
                    class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                >
            </div>

            <div class="flex flex-col text-left space-y-1.5">
                <label for="password" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <input 
                    id="password" 
                    type="password" 
                    v-model="password" 
                    required 
                    autocomplete="new-password"
                    placeholder="min. 6 characters"
                    class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                >
            </div>

            <div class="flex flex-col text-left space-y-1.5">
                <label for="password-confirm" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                <input 
                    id="password-confirm" 
                    type="password" 
                    v-model="passwordConfirm" 
                    required 
                    autocomplete="new-password"
                    placeholder="******"
                    class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all duration-150 placeholder:text-slate-400"
                >
            </div>

            <div v-if="error" class="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl text-center">
                {{ error }}
            </div>
            <div>
                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full py-3 px-4 mt-2 text-sm font-semibold rounded-xl bg-brand-orange text-white hover:bg-brand-orange-hover shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {{ isLoading ? 'Signing Up...' : 'Sign Up' }}
                </button>
            </div>

            <div class="relative flex items-center justify-center my-6 w-full">
                <span class="absolute w-full border-t border-slate-200"></span>
                <span class="relative z-10 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white">OR</span>
            </div>

            <div class="grid grid-cols-3 gap-3 w-full">
                <button
                    class="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 disabled:opacity-50 cursor-pointer"
                    type="button"
                    @click="handleSocialSignup('google')"
                    :disabled="isLoading"
                >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;" height="24px" width="24px">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </button>

                <button
                    class="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 disabled:opacity-50 cursor-pointer"
                    type="button"
                    @click="handleSocialSignup('facebook')"
                    :disabled="isLoading"
                >
                    <svg class="text-blue-600 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24px" height="24px"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z"/></svg>
                </button>

                <button
                    class="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 disabled:opacity-50 cursor-pointer"
                    type="button"
                    @click="handleSocialSignup('github')"
                    :disabled="isLoading"
                >
                    <svg class="text-slate-800 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.803 8.207 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.334-1.755-1.334-1.755-1.087-.74.082-.725.082-.725 1.205.085 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.492.998.108-.775.419-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1-.322 3.3.123.95-.264 1.956-.396 2.956-.396s2.006.132 2.956.396c2.3-0.445 3.3-0.123 3.3 0 .645 1.653.24 2.873.105 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.62-5.474 5.92.43.37.82.903.82 1.817 0 1.305-.01 2.35-.01 2.67 0 .318.22.687.825.575C20.565 21.826 24 17.325 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFirebaseAuth, useFirestore, useCurrentUser } from 'vuefire';
import { 
         createUserWithEmailAndPassword,
         GoogleAuthProvider,
         FacebookAuthProvider,
         GithubAuthProvider,
         signInWithPopup,
         updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';

export default defineComponent({
    emits: ['signup-success'],
    setup(props, { emit }) {
        const auth: any = useFirebaseAuth();
        const router = useRouter();
        const dbInstance = useFirestore();
        const currentUser = useCurrentUser();

        const email = ref('');
        const password = ref('');
        const passwordConfirm = ref('');
        const displayName = ref('');
        const error = ref<string | null>(null);
        const isLoading = ref(false);

        const providers = {
            google: new GoogleAuthProvider(),
            facebook: new FacebookAuthProvider(),
            github: new GithubAuthProvider(),
        };

        const handleSocialSignup = async (providerName: keyof typeof providers) => {
            error.value = null;
            isLoading.value = true;

            const authInstance = auth.value;
            if (!authInstance) {
                error.value = 'Firebase service is not ready.';
                isLoading.value = false;
                return;
            }

            try {
                const provider = providers[providerName];

                if (providerName === 'facebook') {
                    provider.addScope('email');
                    provider.addScope('public_profile');
                }

                await signInWithPopup(authInstance, provider);

                router.push('/');
            } catch (err) {
                console.error(`${providerName} Sign-In Failed:`, err);
                if (err instanceof Error) {
                    error.value = err.message;
                } else {
                    error.value = `${providerName} Sign-In failed. Please try again.`;
                }
            } finally {
                isLoading.value = false;
            }
        };

        const handleSignup = async () => {
            error.value = null;
            isLoading.value = true;

            if (password.value !== passwordConfirm.value) {
                error.value = 'Passwords do not match.';
                return;
            }

            if (!email.value || password.value.length < 6) {
                error.value = 'Please enter a valid email and a password of at least 6 characters';
                return;
            }

            try {
                const authInstance = getFirebaseAuth();
                const userCredential = await createUserWithEmailAndPassword(
                    authInstance,
                    email.value,
                    password.value
                );

                const user = userCredential.user;
                if (!user || !user.uid) {
                    throw new Error('User creation failed or UID is missing. Check Firebase Auth settings.');
                }

                await updateProfile(user, {
                    displayName: displayName.value,
                });

                const dbInstance = getFirebaseDb();

                const userDocRef = doc(dbInstance, 'users', user.uid);

                await setDoc(userDocRef, {
                    uid: user.uid,
                    displayName: displayName.value,
                    email: user.email,
                    favorites: [],
                    createdAt: new Date(),
                });

                emit('signup-success');
            } catch (err: any) {
                console.error('Signup Error:', err.code, err.message);
                if (err.code === 'auth/email-already-in-use') {
                    error.value = 'This email is already in use.';
                } else if (err.code === 'auth/weak-password') {
                    error.value = 'Password must be at least 6 characters.';
                } else {
                    error.value = 'Sign up failed. Please check your details.';
                }
            } finally {
                isLoading.value = false;
            }
        };

        return {
            handleSignup,
            handleSocialSignup,
            isLoading,
            error,
            password,
            passwordConfirm,
            email,
            currentUser,
            displayName,
        };
    },

});
</script>

<style scoped>
</style>