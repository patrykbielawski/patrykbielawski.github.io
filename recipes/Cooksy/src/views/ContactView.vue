<template>
    <div class="contact-card">
        <div class="contact-info">
            <h2>Connect with the Creator:</h2>
            <p>Thanks for checking out my work! I created Cooksy as a demonstration of my skills in Vue.js, Typescript and CSS. If you have feedback on this project, a challenging new idea, or want to discuss a potential opportunity, I'd love to hear from you!</p>
            
        </div>
        <div class="contact-details">
            <div class="website">
                <span class="material-icons">public</span>
                <p class="details"><a href="https://patrykbielawski.github.io">patrykbielawski.github.io</a></p>
            </div>
            <div class="email">
                <span class="material-icons">mail</span>
                <p class="details"><a href="mailto:patryk@bielaw.ski">patryk@bielaw.ski</a></p>
            </div>
            <div class="phone">
                <span class="material-icons">call</span>
                <p class="details"><a href="tel:+48501705119">+48 501 705 119</a></p>
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

    .contact-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5rem auto;
        flex-shrink: 1;
        width: 80vw;
        aspect-ratio: 2 / 1;
        height: auto;
        max-width: 900px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        font-size: 1.5vw;
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        padding: 0 40px;
        text-align: left;
        font-size: 1em;
        flex-basis: 70%;
        background-color: #4c6c8a;
        color: #f7f7f7;
        border-radius: 8px 0px 0px 8px;
    }

    .contact-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        flex-basis: 30%;
        flex-shrink: 0;
        background-color: #d87c3c;
        color: #223344;
        border-radius: 0px 8px 8px 0px;
        font-size: 1em;
    }

    a {
        text-decoration: none;
        color: #f7f7f7;
    }

    .website,
    .email,
    .phone {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 0.8em;
        padding: 0 10px;
    }

    .material-icons {
        font-size: 1.5em;
    }

    @media only screen and (max-width: 768px) {
        .contact-card {
            font-size: 1.1rem;
            flex-direction: column;
            height: auto;
            aspect-ratio: auto;
            width: 90%;
            align-items: stretch;
        }

        .contact-info,
        .contact-details {
            flex-basis: auto;
            border-radius: 0;
            padding: 20px;
        }

        .contact-info {
            border-radius: 8px 8px 0px 0px;
        }

        .contact-details {
            border-radius: 0px 0px 8px 8px;
        }
    }

</style>