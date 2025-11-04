<template>
  <section class="welcome-section">
    <div class="home-container">
      <div class="home-bg">
        <img class="background-image" alt="Background" src="../assets/home.jpg">
      </div>
      <div class="home">
        <h1>Welcome to Cooksy!</h1>
        <p>Discover and share your favorite recipes!</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div class="quick-links">
        <router-link to="/"><button @click="getRandomRecipe">Random Recipe</button></router-link>
        <router-link to="/submit"><button>Submit a Recipe</button></router-link>
      </div>  
    </div>
  </section>
  <section class="info-section scroll-animate-hidden">
    <h2>About Cooksy</h2>
    <p>Cooksy is your go-to app for discovering and sharing delicious recipes from around the world. Whether you're a seasoned chef or just starting out in the kitchen, Cooksy has something for everyone.</p>
    <p>Join our community of food enthusiasts and start exploring today!</p>
  </section>
  <section class="recommended-section scroll-animate-hidden">
    <h2>Our Recommendations:</h2>
      <div
        class="carousel-viewport"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div class="carousel-track" ref="trackRef">
          <div v-for="meal in carouselMeals" :key="meal.idMeal" class="slide">
            <img class="recommended-image" :alt="meal.strMeal" :src="meal.strMealThumb" @click="router.push({ path: `/recipe/${meal.idMeal} `})">
            <h3>{{ meal.strMeal }}</h3>
            <p>{{ meal.strArea }}</p>
            <router-link :to="`/recipe/${meal.idMeal}`"><button class="recipe-details">See the recipe!</button></router-link>
          </div>
        </div>
        <div class="carousel-controls">
          <button @click="prevSlide">
            <span class="material-icons">chevron_left</span>
          </button>
          <button @click="nextSlide">
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
  </section>
  
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, } from 'vue';
import { useRouter } from 'vue-router';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

export default defineComponent({
  name: 'HomeView',
  props: {
    navbarHeight: {
      type: Number,
      required: true,
      default: 0,
    }
  },

  setup(props) {

    const router = useRouter();
    const carouselMeals = ref<Meal[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    const totalSlides = ref(0);
    const currentSlide = ref(0);
    const trackRef = ref<HTMLDivElement | null>(null);

    const touchStartX = ref(0);
    const touchMoveX = ref(0);
    const touchDist = ref(0);
    const isSwiping = ref(false);
    const THRESHOLD = 30;

    const fetchMealByName = async (name: string): Promise<Meal | null> => {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    };

    const fetchCarouselRecipes = async () => {
      isLoading.value = true;
      error.value = null;

      const mealNames = ['Carbonara', 'Kung Pao Chicken', 'Shawarma'];
      const promises = mealNames.map(name => fetchMealByName(name));

      try {
        const results = await Promise.all(promises);
        carouselMeals.value = results.filter((meal): meal is Meal => meal !== null);

        totalSlides.value = carouselMeals.value.length;
        currentSlide.value = 0;
        updateTrackPosition();
      } catch (err) {
          error.value = 'Failed to load recommended recipes.';
          console.error('Error fetching carousel recipes:', err);
      } finally {
        isLoading.value = false;
      }
    };

    const getRandomRecipe = async () => {
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/random.php`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
          const randomId = data.meals[0].idMeal;
          router.push({ path: `/recipe/${randomId}` });
        } else {
          console.warn('Could not fetch a random recipe. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching random recipe:', err);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX.value = event.touches[0].clientX;
      isSwiping.value = true;

      if (trackRef.value) {
        trackRef.value.style.transition = 'none';
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isSwiping.value) return;

      touchMoveX.value = event.touches[0].clientX;
      touchDist.value = touchMoveX.value - touchStartX.value;

      if (trackRef.value) {
        const firstSlide = trackRef.value.querySelector('.slide') as HTMLElement;
        if (!firstSlide) return;
        const slideWidth = firstSlide.offsetWidth;

        const currentOffset = currentSlide.value * slideWidth;
        const dragOffset = currentOffset - touchDist.value;
        trackRef.value.style.transform = `translateX(-${dragOffset}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isSwiping.value) return;

      if (trackRef.value) {
        trackRef.value.style.transition = 'transform 0.5s ease-in-out';
      }

      if (Math.abs(touchDist.value) > THRESHOLD) {
        if (touchDist.value <0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        updateTrackPosition();
      }

      isSwiping.value = false;
      touchDist.value = 0;
    };

    const updateTrackPosition = () => {
      nextTick(() => {
        if (trackRef.value) {
          const firstSlide = trackRef.value.querySelector('.slide');
          if (!firstSlide) return;
          
          const slideElement = firstSlide as HTMLElement;
          const slideWidth = slideElement.offsetWidth;

          trackRef.value.style.transform = 
            `translateX(-${currentSlide.value * slideWidth}px)`;
        }
      })
    }

    const nextSlide = () => {
      if (totalSlides.value > 0) {
        currentSlide.value = (currentSlide.value + 1) % totalSlides.value;
        updateTrackPosition();
      }
    }

    const prevSlide = () => {
      if (totalSlides.value > 0) {
        currentSlide.value = (currentSlide.value - 1 + totalSlides.value) % totalSlides.value;
        updateTrackPosition();
      }
    }

    onMounted(() => {
      const HERO_ANIMATION_DURATION = 1800;

      fetchCarouselRecipes();

      setTimeout(() => {
        nextTick(() => {
          const sections = document.querySelectorAll('.scroll-animate-hidden');
          sections.forEach(el => {
            el.classList.remove('scroll-animate-hidden');
          });
        });
      }, HERO_ANIMATION_DURATION);

    });

    return {
      totalSlides,
      currentSlide,
      trackRef,
      nextSlide,
      prevSlide,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      carouselMeals,
      isLoading,
      error,
      getRandomRecipe,
      router,
    };
  },
});
</script>

<style scoped>

  .home-container {
      position: relative;
      min-height: 900px;
      max-height: 900px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: space-around;
      flex: none;
      height: auto;
      padding-bottom: 0 !important;
      margin-bottom: 7em;
  }

  .home {
      padding: 20px;
      color: #fff;
      letter-spacing: 2px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
      position: absolute;
      z-index: 1;
      animation: slideInLeft 1s ease-in-out 500ms forwards;
      font-size: 1.2em;
      float: inline-start;
      transform: translateX(-100%);
      opacity: 0;
  }

  .home-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
  }

  .background-image {
      object-fit: cover;
      filter: opacity(90%);
      border-bottom: 1px solid #ddd;
      animation: slideInRight 1s ease-in-out;
  }

  .quick-links {
      position: absolute;
      width: 50%;
      max-width: 800px;
      bottom: 30%;
      left: 30%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      animation: fadeInUp 1s ease-in-out 700ms forwards;
      opacity: 0;
      transform: translateX(100%);
      z-index: 1;
  }

  .quick-links button {
      background-color: rgba(216, 124, 60, 0.75);
      color: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border: 1px solid #4c6c8a;
      width: auto;
      padding: 10px 15px;
  }

  .quick-links button:hover {
      background-color: #4c6c8aBF;
      outline: #d87c3c solid 1px;
      color: #d87c3c;
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.2s;
  }

  .info-section {
      background-color: #ffffff;
      padding: 20px;
      color: #4c6c8a;
      text-align: center;
      width: 80%;
      max-width: 1200px;
      margin: 3em auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 7em;
  }

  .recommended-section {
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
      text-align: center;
  }

  .info-section,
  .recommended-section {
      scroll-margin-top: 100px;
  }

  .recommended-section h2 {
      font-size: clamp(1rem, 8vw, 1.8rem);
      color: #4c6c8a;
      border-bottom: 3px solid #d87c3c;
      padding-bottom: 5px;
      margin-bottom: 20px;
  }

  .carousel-viewport {
      width: 80%;
      min-height: 450px;
      margin: 20px auto;
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.7);
      position: relative;
      padding: 5px;
  }

  .carousel-track {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      width: 300%;
      align-items: flex-start;
  }

  .slide {
      width: calc(100% / 3);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding: 10px;
      text-align: center;
  }

  .slide img {
      width: 100%;
      height: 250px;
      object-fit: contain;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s ease-out;
  }

  .slide img:hover {
    transform: scale(1.02);
  }

  .slide h3 {
      color: #4c6c8a;
      font-size: 1.3rem;
      margin: 10px 0 5px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  .slide p {
      font-size: 0.9rem;
      color: #777;
      margin-bottom: 15px;
  }

  .recipe-details {
      background-color: #d87c3c;
      outline: 1px solid #4c6c8a;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s, outline 0.2s, transform 0.1s;
  }

  .recipe-details:hover {
    background-color: #4c6c8a;
    outline: 1px solid #d87c3c;
    color: #d87c3c;
  }

  button.recipe-details {
      margin: 0 auto;
      width: 150px;
  }

  .carousel-controls {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      pointer-events: none;
  }

  .carousel-controls button {
      background: rgba(255, 255, 255, 0.8);
      border: none;
      color: #4c6c8a;
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      transition: background 0.2s, transform 0.1s;
      pointer-events: auto;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .carousel-controls button:hover {
      background: #4c6c8aBF;
      color: #d87c3c;
  }

  .loading-message, .error-message {
      padding: 20px;
      margin: 20px auto;
      max-width: 600px;
      border-radius: 8px;
  }

  .loading-message {
      background-color: #e6f7ff;
      color: #4c6c8a;
  }

  .error-message {
      background-color: #ffe6e6;
      color: #e74c3c;
  }

</style>