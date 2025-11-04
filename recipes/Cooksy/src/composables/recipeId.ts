interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string | null;
    strArea: string | null;
}

export async function fetchRecipeById(id:string) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error(`Error fetching recipe ${id}:`, error);
        return null;
    }
}