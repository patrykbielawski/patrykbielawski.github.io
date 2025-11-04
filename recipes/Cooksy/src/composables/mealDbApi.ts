interface ListItem {
    strCategory?: string;
    strArea?: string;
}

async function fetchList(endpoint: 'c' | 'a'): Promise<string[]> {
    const url = `https://www.themealdb.com/api/json/v1/1/list.php?${endpoint}=list`;

    try {
        const response = await fetch(url);
        if (!response.ok) return [];

        const data = await response.json();

        if (!data.meals) return [];

        return data.meals.map((item: ListItem) => {
            return endpoint === 'c' ? item.strCategory : item.strArea;
        }).filter((name: string | undefined): name is string => !!name);
    } catch (error) {
        console.error(`Error fetching list for ${endpoint}:`, error);
        return [];
    }
}

export const fetchCategories = () => fetchList('c');
export const fetchAreas = () => fetchList('a');