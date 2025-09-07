export async function fetchRecipeData() {
    try {
        const response = await fetch('recipe.json');
        return await response.json();
    } catch (error) {
        console.error("Couldn't get data from recipe data", error);
        throw error;
    }
}

export function searchRecipes(recipeData, query) {
    if (!query) return recipeData.meals;
    
    return recipeData.meals.filter(meal => 
        meal.strMeal.toLowerCase().includes(query) ||
        meal.strCategory.toLowerCase().includes(query) ||
        meal.strArea.toLowerCase().includes(query) ||
        (meal.strTags && meal.strTags.toLowerCase().includes(query))
    );
}

export function getRecipeById(recipeData, mealId) {
    return recipeData.meals.find(m => m.idMeal === mealId);
}