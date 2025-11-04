<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>
                {{ isLoginMode ? 'Welcome Back!' : 'Create your account!' }}
            </h2>

            <div v-if="isLoginMode">
                    <LoginForm @login-success="handleAuthSuccess" />
            </div>
            <div v-else>
                    <SignupForm @signup-success="handleAuthSuccess" />
            </div>

        </div>
        <div class="form-toggle">
            <div v-if="isLoginMode">
                <span>
                    Not a member yet? <span class="toggle" @click="toggleMode">Sign up to share and save your favorite recipes!</span>
                </span>
            </div>
            <div v-else>
                <span>
                    Already part of our kitchen? <span class="toggle" @click="toggleMode">Log in here!</span>
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

    .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: 80vh;
        padding: 20px;
    }

    .auth-card {
        background-color: #f6f6f6;
        color: #4c6c8a;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }

    .auth-card button {
        width: auto;
    }

    .form-toggle {
        margin-top: 2.75rem;
        font-size: 1.1rem;
        color: #4c6c8a;
    }

    .toggle {
        font-weight: 700;
        color: #d87c3c;
        text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }
    

</style>