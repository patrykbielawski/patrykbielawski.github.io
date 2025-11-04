<template>
  <main>
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

            <p v-else-if="favoriteRecipes.lenght === 0" class="no-favorites">
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
      </section> 
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLogout } from "../composables/handleLogout";
import { fetchFavorite } from "../composables/fetchFav";
import RecipeCard from "../components/RecipeCard.vue";


export default defineComponent({
  name: 'UserProfile',
  components: {
    RecipeCard
  },

  setup() {
    const { currentUser: user } = useLogout();

    const { favoriteRecipes, isLoading, error } = fetchFavorite();

    return {
      user,
      favoriteRecipes,
      isLoading,
      error,
    };
  },
});
</script>

<style scoped>

  .user-profile-wrapper {
    display: grid;
    grid-auto-columns: 1fr;
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
  }

</style>