<template>
  <div id="app-container">
    <nav-bar 
      ref="navBarRef"
      :is-desktop-prop="isDesktop"
      :is-large-desktop-prop="isLargeDesktop"
      @search-toggled="updateNavBarHeight"
    >
      <NavBar />
    </nav-bar>
    <div class="router-view-wrapper" :style="contentPaddingStyle">
      <router-view :navbar-height="navBarHeight" />
    </div>
    <app-footer>
      <AppFooter />
    </app-footer>
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