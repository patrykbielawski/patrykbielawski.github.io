<template>
  <main v-if="user">
    <div class="user-profile-wrapper">
      <section class="welcome-msg">
          <h2>Welcome, {{ user.displayName }}!</h2>
          <div class="separator">
            <div class="line"></div>
          </div>
      </section>
      <section class="favorites">
            <h3>Your favorites:</h3>
            <div class="separator">
              <div class="line"></div>
            </div>

            <p v-if="isLoading" class="loading-message">
              <span class="material-icons spin">autorenew</span> Loading favorite recipes...
            </p>

            <p v-else-if="error" class="error-message">
              Error fetching favorites: {{ error }}
            </p>

            <p v-else-if="favoriteRecipes.length === 0" class="no-favorites">
              You have no favorite recipes yet. <router-link to="/">Find some!</router-link>
            </p>

            <div v-else class="favorites-grid">
              <RecipeCard
                v-for="recipe in favoriteRecipes"
                :key="recipe.idMeal"
                :recipe="recipe"
              />
            </div>
      </section>
      <section class="user-recipes">
          <h3>Your recipes:</h3>
          <div class="separator">
            <div class="line"></div>
          </div>
          <p v-if="isRecipesLoading" class="loading-message">
            <span class="material-icons spin">autorenew</span> Loading your recipes...
          </p>

          <p v-else-if="userRecipes.length === 0" class="no-favorites">
            You haven't submitted any recipes yet. <router-link to="/submit">Share one now!</router-link>
          </p>

          <div v-else class="favorites-grid">
            <RecipeCard
              v-for="recipe in userRecipes"
              :key="recipe.idMeal"
              :recipe="recipe"
            />
          </div>
      </section> 
    </div>
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

  .user-profile-wrapper {
    display: grid;
    grid-auto-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-template-rows: repeat(auto-fit, minmax(150px, auto));
    gap: 10px;
    padding: 20px;
    margin: 0 auto;
    max-width: 80%;
    color: #4c6c8a;
    grid-template-areas:
      "welcome"
      "fav"
      "recipe"
      
  }

  .welcome-msg {
    grid-area: welcome;
    
  }

  .favorites {
    grid-area: fav;
  }

  .user-recipes {
    grid-area: recipe;
  }

  .separator {
        position: relative;
        padding: 1rem 0;
  }

  .line {
        border-top: 1px solid #4c6c8a;
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
  }

  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px 0;
    justify-items: center;
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
</style>