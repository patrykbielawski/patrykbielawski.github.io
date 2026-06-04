<template>
  <main v-if="user" class="max-w-6xl mx-auto py-8 px-6 animate-fade-in-up">
      <section class="mb-8 text-left">
          <h2 class="text-2xl md:text-3xl font-extrabold text-brand-blue">Welcome, {{ user.displayName }}!</h2>
          <div class="my-4 border-t border-slate-250/60"></div>
      </section>

      <section class="mb-10 text-left">
            <h3 class="text-lg md:text-xl font-bold text-slate-800">Your favorites:</h3>
            <div class="my-3 border-t border-slate-200/50"></div>

            <p v-if="isLoading" class="flex items-center gap-2 text-slate-500 font-medium py-4 text-sm">
              <span class="material-icons spin animate-spin">autorenew</span> Loading favorite recipes...
            </p>

            <p v-else-if="error" class="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl text-center my-4">
              Error fetching favorites: {{ error }}
            </p>

            <p v-else-if="favoriteRecipes.length === 0" class="text-slate-500 py-6 text-sm">
              You have no favorite recipes yet. <router-link to="/" class="text-brand-orange hover:underline font-semibold">Find some!</router-link>
            </p>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6 justify-items-center">
              <RecipeCard
                v-for="recipe in favoriteRecipes"
                :key="recipe.idMeal"
                :recipe="recipe"
              />
            </div>
      </section>

      <section class="text-left">
          <h3 class="text-lg md:text-xl font-bold text-slate-800">Your recipes:</h3>
          <div class="my-3 border-t border-slate-200/50"></div>

          <p v-if="isRecipesLoading" class="flex items-center gap-2 text-slate-500 font-medium py-4 text-sm">
            <span class="material-icons spin animate-spin">autorenew</span> Loading your recipes...
          </p>

          <p v-else-if="userRecipes.length === 0" class="text-slate-500 py-6 text-sm">
            You haven't submitted any recipes yet. <router-link to="/submit" class="text-brand-orange hover:underline font-semibold">Share one now!</router-link>
          </p>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6 justify-items-center">
            <RecipeCard
              v-for="recipe in userRecipes"
              :key="recipe.idMeal"
              :recipe="recipe"
            />
          </div>
      </section> 
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import { useLogout } from "../composables/handleLogout";
import { fetchFavorite } from "../composables/fetchFav";
import { fetchUserRecipes } from "../composables/fetchUserRecipes";
import RecipeCard from "../components/RecipeCard.vue";


export default defineComponent({
  name: 'UserProfile',
  components: {
    RecipeCard
  },

  setup() {
    const { currentUser: user } = useLogout();
    const { favoriteRecipes, isLoading, error } = fetchFavorite();
    const { userRecipes, isRecipesLoading } = fetchUserRecipes(user);

    setTimeout(() => {
      if (isRecipesLoading.value) {
        console.warn('Loading timed out after 5 seconds. Force stopping.');
        isRecipesLoading.value = false;
      }
    }, 5000);

    watch(userRecipes, (newVal) => {
      console.log('Recipes found in Firestore:', newVal);
    });

    return {
      user,
      favoriteRecipes,
      isLoading,
      error,
      userRecipes,
      isRecipesLoading,
    };
  },
});
</script>

<style scoped>
</style>