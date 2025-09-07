export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function addToFavorites(mealId) {
    const favorites = getFavorites();
    if (!favorites.includes(mealId)) {
        favorites.push(mealId);
        saveFavorites(favorites);
    }
    return favorites;
}

export function removeFromFavorites(mealId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== mealId);
    saveFavorites(favorites);
    return favorites;
}

export function isFavorite(mealId) {
    const favorites = getFavorites();
    return favorites.includes(mealId);
}

export function getFavoriteMeals(recipeData) {
    const favorites = getFavorites();
    return recipeData.meals.filter(meal => favorites.includes(meal.idMeal));
}