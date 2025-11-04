<template>
    <div class="auth-container">
        <div class="toggle">
            button
        </div>
        <div class="auth-card">
            <h2>
                {{ isLoginMode ? 'Welcome Back!' : 'Create your account!' }}
            </h2>

            <div v-if="isLoginMode">
                <p>
                    [Placeholder for LoginForm.vue]
                </p>
            </div>
            <div v-else>
                <signup-form>
                    <SignupForm />
                </signup-form>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { computed, ref, } from 'vue';
import SignupForm from '../components/SignupForm.vue';

export default {
  components: { SignupForm },

    setup(){
        const isLoginMode = ref(false);

        const toggleMode = () => {
            isLoginMode.value = !isLoginMode.value;
        };

        const toggleButtonText = computed(() =>
            isLoginMode.value
                ? "Already a member? Log In."
                : "Become a part of our community!"
        );

        return {
            toggleMode,
            isLoginMode,
            toggleButtonText,
        }
    },
};
</script>

<style scoped>

    .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
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

</style>