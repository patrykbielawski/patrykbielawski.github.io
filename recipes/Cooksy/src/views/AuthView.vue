<template>
    <div class="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in-up">
        <div class="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-md text-slate-800 space-y-6 auth-card">
            <h2 class="text-xl md:text-2xl font-extrabold text-brand-blue text-center">
                {{ isLoginMode ? 'Welcome Back!' : 'Create your account!' }}
            </h2>

            <div v-if="isLoginMode">
                <LoginForm @login-success="handleAuthSuccess" />
            </div>
            <div v-else>
                <SignupForm @signup-success="handleAuthSuccess" />
            </div>

        </div>
        <div class="text-center mt-6 text-sm text-slate-500 font-medium form-toggle">
            <div v-if="isLoginMode">
                <span>
                    Not a member yet? <span class="text-brand-orange hover:text-brand-orange-hover hover:underline font-bold cursor-pointer transition-colors toggle" @click="toggleMode">Sign up to share and save your favorite recipes!</span>
                </span>
            </div>
            <div v-else>
                <span>
                    Already part of our kitchen? <span class="text-brand-orange hover:text-brand-orange-hover hover:underline font-bold cursor-pointer transition-colors toggle" @click="toggleMode">Log in here!</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, } from 'vue';
import { useRouter } from 'vue-router';
import SignupForm from '../components/SignupForm.vue';
import LoginForm from '../components/LoginForm.vue';

export default {
  components: { SignupForm, LoginForm },

    setup(){
        const isLoginMode = ref(true);
        const router = useRouter();

        const toggleMode = () => {
            isLoginMode.value = !isLoginMode.value;
        };

        const handleAuthSuccess = () => {
            router.push({ name: 'Home' });
        };

        return {
            toggleMode,
            isLoginMode,
            handleAuthSuccess,
        }
    },
};
</script>

<style scoped>
</style>