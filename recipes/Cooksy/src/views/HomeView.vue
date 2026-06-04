<template>
  <section class="relative h-[480px] md:h-[540px] overflow-hidden flex items-center justify-center mb-12">
    <div class="absolute inset-0 z-0">
      <img class="w-full h-full object-cover brightness-[0.65]" alt="Background" src="../assets/home.jpg">
    </div>
    <div class="relative z-10 text-center text-white px-6 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">Welcome to Cooksy!</h1>
      <p class="text-base md:text-lg text-slate-100 drop-shadow-sm font-medium">Discover and share your favorite recipes!</p>
      <p class="text-xs md:text-sm text-slate-200 opacity-90 drop-shadow-xs max-w-md">Join our food enthusiast community and start exploring today.</p>
      
      <div class="flex flex-wrap justify-center gap-3 pt-4">
        <router-link to="/"><button @click="getRandomRecipe" class="px-5 py-2.5 font-bold text-xs md:text-sm rounded-xl bg-brand-orange/95 text-white border border-brand-orange hover:bg-brand-blue hover:text-brand-orange hover:shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer">Random Recipe</button></router-link>
        <router-link to="/submit"><button class="px-5 py-2.5 font-bold text-xs md:text-sm rounded-xl bg-brand-orange/95 text-white border border-brand-orange hover:bg-brand-blue hover:text-brand-orange hover:shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer">Submit a Recipe</button></router-link>
      </div>  
    </div>
  </section>

  <section class="bg-white border border-slate-100 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto my-12 shadow-xs space-y-4 info-section scroll-animate-hidden">
    <h2 class="text-xl md:text-2xl font-bold text-brand-blue">About Cooksy</h2>
    <p class="text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">Cooksy is your go-to app for discovering and sharing delicious recipes from around the world. Whether you're a seasoned chef or just starting out in the kitchen, Cooksy has something for everyone.</p>
    <p class="text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">Join our community of food enthusiasts and start exploring today!</p>
  </section>

  <section class="max-w-4xl mx-auto my-12 px-6 text-center recommended-section scroll-animate-hidden">
    <h2 class="text-xl md:text-2xl font-bold text-brand-blue border-b-2 border-brand-orange pb-2 mb-6 inline-block">Our Recommendations:</h2>
    <div
      class="relative w-full max-w-xl mx-auto overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-md p-4 md:p-6"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="flex transition-transform duration-500 ease-out" ref="trackRef" style="width: 300%;">
        <div v-for="meal in carouselMeals" :key="meal.idMeal" class="w-1/3 flex-shrink-0 flex flex-col items-center justify-center p-3 text-center">
          <img class="w-full max-w-xs h-48 md:h-56 object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-xs" :alt="meal.strMeal" :src="meal.strMealThumb" @click="router.push({ path: `/recipe/${meal.idMeal} `})">
          <h3 class="text-base font-bold text-slate-800 mt-3 mb-1 truncate max-w-[200px]">{{ meal.strMeal }}</h3>
          <p class="text-xs text-slate-500 mb-3">{{ meal.strArea }}</p>
          <router-link :to="`/recipe/${meal.idMeal}`">
            <button class="px-4 py-2 text-xs font-semibold rounded-full bg-brand-orange text-white hover:bg-brand-blue hover:text-brand-orange shadow-xs active:scale-95 transition-all duration-200 cursor-pointer">See the recipe!</button>
          </router-link>
        </div>
      </div>
      <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-3 pointer-events-none">
        <button @click="prevSlide" class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md text-brand-blue hover:bg-brand-blue hover:text-brand-orange pointer-events-auto transition-all active:scale-95 cursor-pointer">
          <span class="material-icons text-lg">chevron_left</span>
        </button>
        <button @click="nextSlide" class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md text-brand-blue hover:bg-brand-blue hover:text-brand-orange pointer-events-auto transition-all active:scale-95 cursor-pointer">
          <span class="material-icons text-lg">chevron_right</span>
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
      if (event.touches.length === 0) return;

      touchStartX.value = event.touches[0]!.clientX;
      isSwiping.value = true;

      if (trackRef.value) {
        trackRef.value.style.transition = 'none';
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isSwiping.value) return;

      if (event.touches.length === 0) return;

      touchMoveX.value = event.touches[0]!.clientX;
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
</style>