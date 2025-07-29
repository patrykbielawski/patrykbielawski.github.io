document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const recipeResultsDiv = document.getElementById('recipeResults');

    searchButton.addEventListener('click', () => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchRecipes(searchTerm);
        } else {
            recipeResultsDiv.innerHTML = '<p>Please enter an ingredient.</p>';
        }
    });

async function fetchRecipes(searchTerm) {
        // Clear previous results
        recipeResultsDiv.innerHTML = '<p>Loading recipes...</p>';

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.meals) {
                displayRecipes(data.meals);
            } else {
                recipeResultsDiv.innerHTML = '<p>No recipes found for your ingredient. Try another!</p>';
            }
        } 
            catch (error) {
            console.error('Error fetching recipes:', error);
            recipeResultsDiv.innerHTML = `<p>Error fetching recipes: ${error.message}</p>`;
            }
        }
    
        function displayRecipes(recipes) {

            recipeResultsDiv.innerHTML = '';

            recipes.forEach(meal => {
                const mealDiv = document.createElement('div');
                mealDiv.className = 'recipe';
                mealDiv.innerHTML = `
                    <h3>${meal.strMeal}</h3>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Area:</strong> ${meal.strArea}</p>
                    <a href="${meal.strYoutube}" class="youtube" target="_blank"><i class="fa-brands fa-youtube"></i></a>
                    <button class="view-recipe-btn" data-meal-id="${meal.idMeal}">View Recipe</button>
                `;
                recipeResultsDiv.appendChild(mealDiv);
            });

                const viewRecipeButtons = document.querySelectorAll('.view-recipe-btn');
            viewRecipeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const mealId = event.target.dataset.mealId;
                fetchMealDetails(mealId);
            });
        });
    }

    async function fetchMealDetails(mealId) {
        console.log(`Fetching details for meal ID: ${mealId}`);
        recipeResultsDiv.innerHTML = '<p>Loading meal details...</p>';

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                console.log('Meal details:', meal);

                let youtubeEmbedHtml = '';
                if (meal.strYoutube) {
                    const videoIdMatch = meal.strYoutube.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|live\/|shorts\/))([^&\n?#]+)/);
                    if (videoIdMatch && videoIdMatch[1]) {
                        const videoId = videoIdMatch[1];
                        youtubeEmbedHtml = `
                            <div class="video-container">
                                <iframe 
                                    src="https://www.youtube.com/embed/${videoId}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                ></iframe>
                            </div>
                        `;
                    }
                }
                recipeResultsDiv.innerHTML = `
                    <div class="meal-detail-card">
                        <h2>${meal.strMeal}</h2>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <p><strong>Category:</strong> ${meal.strCategory}</p>
                        <p><strong>Area:</strong> ${meal.strArea}</p>
                        <h3>Ingredients:</h3>
                        <ul>
                            ${Object.keys(meal).filter(key => key.startsWith('strIngredient') && meal[key]).map(key => `<li>${meal[key]} - ${meal[`strMeasure${key.slice(13)}`]}</li>`).join('')}
                        </ul>
                        <h3>Instructions:</h3>
                        <p>${meal.strInstructions}</p>
                        ${youtubeEmbedHtml}
                        <div class="meal-detail-actions">
                        <button ="#" id="back" id="actionButton"><i class="fa-solid fa-arrow-left-long"></i></button>
                        </div>
                    </div>
                    
                `;
                document.getElementById('back').addEventListener('click', () => {
                    const searchTerm = searchInput.value.trim();
                    if (searchTerm) {
                        fetchRecipes(searchTerm);
                    } else {
                        recipeResultsDiv.innerHTML = '';
                    }
                });

            } else {
                recipeResultsDiv.innerHTML = '<p>Meal details not found.</p>';
            }

        } catch (error) {
            console.error('Error fetching meal details:', error);
            recipeResultsDiv.innerHTML = `<p>Error fetching meal details: ${error.message}</p>`;
        }
    }
});