<template>
  <div id="app-container" class="flex flex-col min-h-screen bg-slate-50">
    <NavBar 
      ref="navBarRef"
      :is-desktop-prop="isDesktop"
      :is-large-desktop-prop="isLargeDesktop"
      @search-toggled="updateNavBarHeight"
    />
    <div class="flex-grow min-h-[80vh] transition-[padding] duration-150 ease-out" :style="contentPaddingStyle">
      <router-view :navbar-height="navBarHeight"/>
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import NavBar from './components/NavBar.vue';
import AppFooter from './components/AppFooter.vue';

interface NavBarExposed {
  navElementRef: HTMLElement | null;
}

export default defineComponent({
  name: 'App',
  components: { NavBar , AppFooter },
  setup() {
    const screenWidth = ref(window.innerWidth);
    const isDesktop = ref(screenWidth.value >= 768);
    const isLargeDesktop = ref(screenWidth.value >= 1024);

    const updateScreenSize = () => {
      screenWidth.value = window.innerWidth;
      isDesktop.value = screenWidth.value >= 768;
      isLargeDesktop.value = screenWidth.value >= 1024;

      updateNavBarHeight();
    };

    const navBarRef = ref<NavBarExposed | null>(null);
    const navBarHeight = ref(0);
    const contentPaddingStyle = computed(() => {
      return {
        'padding-top': `${navBarHeight.value + 5}px`,
      };
    });

    const ANIMATION_DURATION = 150;

    const updateNavBarHeight = () => {
      nextTick(() => {
        setTimeout(() => {
          if (navBarRef.value && navBarRef.value.navElementRef) {
            const navEl = navBarRef.value.navElementRef;

            if (navEl) {
              navBarHeight.value = navEl.offsetHeight;
            }
          }
        }, ANIMATION_DURATION + 20);
      });
    };
      

    onMounted(() => {
      updateScreenSize();

      window.addEventListener('resize', updateScreenSize);
      updateScreenSize();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateScreenSize);
    });

    return {
        isLargeDesktop,
        isDesktop,
        navBarRef,
        navBarHeight,
        contentPaddingStyle,
        updateNavBarHeight,
       };
  }});
</script>

<style scoped>
</style>