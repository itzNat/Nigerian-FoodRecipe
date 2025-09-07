export function createRecipeCard(meal, isFavorite = false) {
  return `
        <div class="recipe-card bg-white rounded-lg overflow-hidden shadow-md">
            <div class="relative overflow-hidden h-48">
                <img src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }" class="recipe-image w-full h-full object-cover">
                <button class="favorite-btn absolute top-3 right-3 bg-white p-2 rounded-full shadow-md" data-id="${
                  meal.idMeal
                }">
                    <i class="fas fa-heart heart-animation ${
                      isFavorite ? "active" : ""
                    }" style="color: ${
    isFavorite ? "#FF7F50" : "transparent"
  }; -webkit-text-stroke: 1px ${isFavorite ? "#FF7F50" : "#000"};"></i>
                </button>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${meal.strMeal}</h3>
                <p class="text-gray-500 text-sm">${
                  meal.strArea || "International"
                } ${meal.strCategory ? "• " + meal.strCategory : ""}</p>
                <button class="mt-4 text-[#FF7F50] font-medium hover:underline view-recipe-btn" data-id="${
                  meal.idMeal
                }">
                    View Recipe
                </button>
            </div>
        </div>
    `;
}

export function createRecipeDetailContent(meal) {
  let ingredientsHtml = "";
  if (meal.strIngredient && meal.strIngredient.length > 0) {
    ingredientsHtml = `
            <h4 class="font-semibold text-lg mb-2">Ingredients</h4>
            <ul class="list-disc list-inside mb-4">
                ${meal.strIngredient
                  .map(
                    (ingredient, index) =>
                      `<li>${
                        meal.strMeasure && meal.strMeasure[index]
                          ? meal.strMeasure[index] + " "
                          : ""
                      }${ingredient}</li>`
                  )
                  .join("")}
            </ul>
        `;
  }

  let instructionsHtml = "";
  if (meal.strInstructions && meal.strInstructions.length > 0) {
    instructionsHtml = `
            <h4 class="font-semibold text-lg mb-2">Instructions</h4>
            <ol class="list-decimal list-inside mb-4">
                ${meal.strInstructions
                  .map((step) => `<li>${step}</li>`)
                  .join("")}
            </ol>
        `;
  }

  return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <img src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }" class="w-full h-64 object-cover rounded-lg">
                <div class="mt-4">
                    ${
                      meal.strCategory
                        ? `<p class="mb-1"><span class="font-semibold">Category:</span> ${meal.strCategory}</p>`
                        : ""
                    }
                    ${
                      meal.strArea
                        ? `<p class="mb-1"><span class="font-semibold">Cuisine:</span> ${meal.strArea}</p>`
                        : ""
                    }
                    ${
                      meal.strTags
                        ? `<p class="mb-1"><span class="font-semibold">Tags:</span> ${meal.strTags}</p>`
                        : ""
                    }
                </div>
            </div>
            <div>
                ${ingredientsHtml}
                ${instructionsHtml}
            </div>
        </div>
    `;
}

export function showSuccessMessage(element) {
  element.classList.remove("hidden");
  setTimeout(() => {
    element.classList.add("hidden");
  }, 3000);
}
