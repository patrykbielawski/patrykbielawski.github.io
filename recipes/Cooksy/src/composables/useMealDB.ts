export interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
}

interface RawMeal {
    idMeal: string;
    strMeal: string;
    strCategory: string | null;
    strArea: string | null;
    strMealThumb: string | null;
}

const fetchWithBackoff = async (url: string, maxRetries = 5, delay = 1000) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (attempt === maxRetries - 1) {
                console.error('API call failed after all retries:', error);
                throw error;
            }
            const backoffTime = delay * Math.pow(2, attempt) + Math.random() * 500;
            console.warn(`Attempt ${attempt + 1} failed. Retrying in ${backoffTime.toFixed(0)}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
    }

    throw new Error('Failed to fetch data after all retries.');
}

export async function searchMeals(query: string): Promise<Meal[] | null> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return [];
    }

    const endpoint = trimmedQuery.length === 1
        ? `https://www.themealdb.com/api/json/v1/1/search.php?f=${trimmedQuery}`
        : `https://www.themealdb.com/api/json/v1/1/search.php?s=${trimmedQuery}`;

    try {
        const data = await fetchWithBackoff(endpoint) as { meals: RawMeal[] | null };

        if (data && data.meals) {
            return data.meals.map((m: RawMeal) => ({
                idMeal: m.idMeal,
                strMeal: m.strMeal,
                strCategory: m.strCategory || 'N/A',
                strArea: m.strArea || 'N/A',
                strMealThumb: m.strMealThumb || 'https://placehold.co/150x150/EEEEEE/AAAAAA?text=No+Image',
            })) as Meal[];
        } else {
            return [];
        }
    } catch (e) {
        throw new Error('Could not connect to the recipe database.');
    }
}