<template>
    <div class="max-w-4xl mx-auto my-16 px-6 animate-fade-in-up">
        <div class="flex flex-col md:flex-row bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-md max-w-3xl mx-auto text-left contact-card">
            <div class="md:w-3/5 bg-brand-blue text-white p-8 md:p-10 flex flex-col justify-center space-y-4 contact-info">
                <h2 class="text-xl md:text-2xl font-extrabold">Connect with the Creator</h2>
                <p class="text-sm leading-relaxed text-slate-100">Thanks for checking out my work! I created Cooksy as a demonstration of my skills in Vue.js, Typescript and CSS. If you have feedback on this project, a challenging new idea, or want to discuss a potential opportunity, I'd love to hear from you!</p>
            </div>
            <div class="md:w-2/5 bg-brand-orange text-white p-8 flex flex-col justify-center space-y-4 contact-details">
                <div class="flex items-center gap-3 text-sm website">
                    <span class="material-icons text-xl">public</span>
                    <p class="details"><a href="https://patrykbielawski.github.io" class="font-semibold text-slate-100 hover:underline">patrykbielawski.github.io</a></p>
                </div>
                <div class="flex items-center gap-3 text-sm email">
                    <span class="material-icons text-xl">mail</span>
                    <p class="details"><a href="mailto:patryk@bielaw.ski" class="font-semibold text-slate-100 hover:underline">patryk@bielaw.ski</a></p>
                </div>
                <div class="flex items-center gap-3 text-sm phone">
                    <span class="material-icons text-xl">call</span>
                    <p class="details"><a href="tel:+48501705119" class="font-semibold text-slate-100 hover:underline">+48 501 705 119</a></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({

});
</script>

<style scoped>
</style>