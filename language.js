const translations = {
    en: {
        about: "About Me",
        aboutPanelHeader: "About Me",
        aboutPanelText: "I am a motivated career-changer with experience in logistics and as a driver, which has taught me discipline, responsibility, and effective time management. I am currently developing my skills in HTML5, CSS3, and basic JavaScript by building responsive websites and learning tools such as Git. My goal is to begin my career as a Frontend Developer and, in the longer term, to fully leverage my passion for programming as a Fullstack Developer.",
        projects: "Projects",
        projectsPanelHeader: "Projects",
        projectsPanelText: "Weather App",
        skills: "Skills",
        skillsPanelHeader: "Skills",
        skillsPanelText: "My skills include:",
        contact: "Contact",
        intro: "Welcome to my interactive resume",
        choose: "Choose where you want to start",
        contactInfo: "You can contact me via:",
        contactPanel: "Contact me",
        footerCopy: "© 2025 All rights reserved",
        footerMadeBy: "Made by Patryk Bielawski",
    },
    pl: {
        about: "O mnie",
        aboutPanelHeader: "O mnie",
        aboutPanelText: "Jestem zmotywowanym kandydatem w trakcie przebranżowienia z doświadczeniem w logistyce i pracy jako kierowca, co nauczyło mnie dyscypliny, odpowiedzialności i efektywnej organizacji czasu. Obecnie rozwijam umiejętności w zakresie HTML5, CSS3 oraz podstaw JavaScript, tworząc responsywne strony internetowe i poznając narzędzia takie jak Git. Moim celem jest rozpoczęcie kariery jako frontend developer, a w dalszej perspektywie pełne wykorzystanie pasji do programowania w roli fullstack developera.",
        projects: "Projekty",
        projectsPanelHeader: "Projekty",
        projectsPanelText: "Pogodynka",
        skills: "Umiejętności",
        skillsPanelHeader: "Umiejętności",
        skillsPanelText: "Moje umiejętności obejmują:",
        contact: "Kontakt",
        intro: "Witam w moim interaktywnym CV",
        choose: "Wybierz, od czego chcesz zacząć:",
        contactInfo: "Możesz się ze mną skontaktować przez:",
        contactPanel: "Skontaktuj się ze mną",
        footerCopy: "Wszelkie prawa zastrzeżone © 2025",
        footerMadeBy: "Wykonane przez Patryka Bielawskiego",
    },
};

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.querySelector('.intro h1').textContent = translations[lang].intro;
    document.querySelector('.intro p').textContent = translations[lang].choose;
    document.querySelector('.button[href="#about"]').textContent = translations[lang].about;
    document.querySelector('#about h2').textContent = translations[lang].aboutPanelHeader;
    document.querySelector('#about p').textContent = translations[lang].aboutPanelText;
    document.querySelector('.button[href="#projects"]').textContent = translations[lang].projects;
    document.querySelector('#projects h2').textContent = translations[lang].projectsPanelHeader;
    document.querySelector('#projects strong').textContent = translations[lang].projectsPanelText;
    document.querySelector('.button[href="#skills"]').textContent = translations[lang].skills;
    document.querySelector('#skills h2').textContent = translations[lang].skillsPanelHeader;
    document.querySelector('#skills p').textContent = translations[lang].skillsPanelText;
    document.querySelector('.button[href="#contact"]').textContent = translations[lang].contact;
    document.querySelector('#contact p').textContent = translations[lang].contactInfo;
    document.querySelector('#contact h2').textContent = translations[lang].contactPanel;
    document.querySelector('.footer p:nth-of-type(1)').textContent = translations[lang].footerCopy;
    document.querySelector('.footer p:nth-of-type(2)').textContent = translations[lang].footerMadeBy;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'pl';
    setLanguage(savedLang);
});