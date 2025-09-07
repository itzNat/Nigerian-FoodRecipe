import { fetchRecipeData, searchRecipes, getRecipeById } from './recipeAPI.js';
import { 
    getFavorites, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    getFavoriteMeals 
} from './favoritesManager.js';
import { paginateItems } from './paginationManager.js';
import { 
    createRecipeCard, 
    createRecipeDetailContent, 
    showSuccessMessage 
} from './uiHelpers.js';
import { 
    addIngredientField, 
    addInstructionField, 
    updateInstructionNumbers, 
    validateForm, 
    getFormData 
} from './formManager.js';

// Global variables
let recipeData = '';
let filteredRecipes = [];
let currentPage = 1;
const recipesPerPage = 6;

// DOM Elements
const homePage = document.getElementById('homepage');
const searchPage = document.getElementById('search-page');
const favoritesPage = document.getElementById('favorites-page');
const searchResults = document.getElementById('search-results');
const favoritesResults = document.getElementById('favorites-results');
const noFavorites = document.getElementById('no-favorites');
const searchInput = document.getElementById('search-input');
const heroSearchInput = document.getElementById('hero-search-input');
const searchBtn = document.getElementById('search-btn');
const heroSearchBtn = document.getElementById('hero-search-btn');
const exploreBtn = document.getElementById('explore-btn');
const submitRecipeModal = document.getElementById('submit-recipe-modal');
const recipeDetailModal = document.getElementById('recipe-detail-modal');
const recipeForm = document.getElementById('recipe-form');
const closeModal = document.getElementById('close-modal');
const closeRecipeModal = document.getElementById('close-recipe-modal');
const cancelForm = document.getElementById('cancel-form');
const successMessage = document.getElementById('success-message');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumbers = document.getElementById('page-numbers');
const recipeModalTitle = document.getElementById('recipe-modal-title');
const recipeDetailContent = document.getElementById('recipe-detail-content');

// Navigation links
const homeLink = document.getElementById('home-link');
const searchLink = document.getElementById('search-link');
const favoritesLink = document.getElementById('favorites-link');
const submitRecipeLink = document.getElementById('submit-recipe-link');
const mobileHomeLink = document.getElementById('mobile-home-link');
const mobileSearchLink = document.getElementById('mobile-search-link');
const mobileFavoritesLink = document.getElementById('mobile-favorites-link');
const mobileSubmitRecipeLink = document.getElementById('mobile-submit-recipe-link');

// Initialize the application
document.addEventListener('DOMContentLoaded', async function () {
    try {
        recipeData = await fetchRecipeData();
        setupEventListeners();
        showHomePage({preventDefault: () => {}});
    } catch (error) {
        console.error("Failed to initialize application:", error);
        searchResults.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-5xl text-red-300 mb-4"></i>
                <h3 class="text-xl text-red-500">Failed to load recipes</h3>
                <p class="text-gray-400 mt-2">Please try refreshing the page</p>
            </div>
        `;
    }
});

function setupEventListeners() {
    // Navigation
    homeLink.addEventListener('click', showHomePage);
    searchLink.addEventListener('click', showSearchPage);
    favoritesLink.addEventListener('click', showFavoritesPage);
    submitRecipeLink.addEventListener('click', showSubmitRecipeModal);
    mobileHomeLink.addEventListener('click', showHomePage);
    mobileSearchLink.addEventListener('click', showSearchPage);
    mobileFavoritesLink.addEventListener('click', showFavoritesPage);
    mobileSubmitRecipeLink.addEventListener('click', showSubmitRecipeModal);
    
    // Search functionality
    heroSearchBtn.addEventListener('click', handleHeroSearch);
    searchBtn.addEventListener('click', handleSearch);
    exploreBtn.addEventListener('click', showSearchPage);
    
    // Modal controls
    closeModal.addEventListener('click', hideSubmitRecipeModal);
    closeRecipeModal.addEventListener('click', hideRecipeDetailModal);
    cancelForm.addEventListener('click', hideSubmitRecipeModal);
    recipeForm.addEventListener('submit', handleRecipeSubmit);
    
    // Mobile menu
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Pagination
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    
    // Form dynamic fields
    document.getElementById('add-ingredient').addEventListener('click', function() {
        const container = document.getElementById('ingredients-container');
        const newRow = addIngredientField(container);
        
        // Add event listener to the new remove button
        newRow.querySelector('.remove-ingredient').addEventListener('click', function() {
            this.parentElement.remove();
            
            // Hide remove buttons if there's only one ingredient left
            if (container.children.length === 1) {
                document.querySelector('.remove-ingredient').style.display = 'none';
            }
        });
    });
    
    document.getElementById('add-instruction').addEventListener('click', function() {
        const container = document.getElementById('instructions-container');
        const newRow = addInstructionField(container);
        
        // Add event listener to the new remove button
        newRow.querySelector('.remove-instruction').addEventListener('click', function() {
            this.parentElement.remove();
            updateInstructionNumbers(container);
            
            // Hide remove buttons if there's only one instruction left
            if (container.children.length === 1) {
                document.querySelector('.remove-instruction').style.display = 'none';
            }
        });
    });
    
    // Search on keypress (with debouncing)
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch();
        }, 300);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    heroSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleHeroSearch();
        }
    });
}

// Page Navigation Functions
function showHomePage(e) {
    e.preventDefault();
    homePage.classList.remove('hidden');
    searchPage.classList.add('hidden');
    favoritesPage.classList.add('hidden');
    mobileMenu.classList.add('hidden');
}

function showSearchPage(e) {
    if (e) e.preventDefault();
    homePage.classList.add('hidden');
    searchPage.classList.remove('hidden');
    favoritesPage.classList.add('hidden');
    mobileMenu.classList.add('hidden');
    
    // Display all recipes initially
    filteredRecipes = recipeData.meals;
    currentPage = 1;
    displayRecipes(filteredRecipes);
    searchInput.focus();
}

function showFavoritesPage(e) {
    e.preventDefault();
    homePage.classList.add('hidden');
    searchPage.classList.add('hidden');
    favoritesPage.classList.remove('hidden');
    mobileMenu.classList.add('hidden');
    loadFavorites();
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Modal Functions
function showSubmitRecipeModal(e) {
    e.preventDefault();
    submitRecipeModal.classList.add('active');
    mobileMenu.classList.add('hidden');
}

function hideSubmitRecipeModal() {
    submitRecipeModal.classList.remove('active');
    recipeForm.reset();
    // Reset validation errors
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('shake');
        input.nextElementSibling.classList.add('hidden');
    });
}

function showRecipeDetailModal(meal) {
    recipeModalTitle.textContent = meal.strMeal;
    recipeDetailContent.innerHTML = createRecipeDetailContent(meal);
    recipeDetailModal.classList.add('active');
}

function hideRecipeDetailModal() {
    recipeDetailModal.classList.remove('active');
}

// Search Functions
function handleHeroSearch() {
    const query = heroSearchInput.value.trim();
    if (query) {
        searchInput.value = query;
        showSearchPage({preventDefault: () => {}});
        handleSearch();
    }
}

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
        filteredRecipes = searchRecipes(recipeData, query);
    } else {
        filteredRecipes = recipeData.meals;
    }
    
    currentPage = 1;
    displayRecipes(filteredRecipes);
}

// Recipe Display Functions
function displayRecipes(meals) {
    if (meals.length === 0) {
        searchResults.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-xl text-gray-500">No recipes found for "${searchInput.value}"</h3>
                <p class="text-gray-400 mt-2">Try a different search term</p>
            </div>
        `;
        pagination.classList.add('hidden');
        return;
    }
    
    // Calculate pagination
    const paginationResult = paginateItems(meals, currentPage, recipesPerPage);
    
    searchResults.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${paginationResult.items.map(meal => createRecipeCard(meal, isFavorite(meal.idMeal))).join('')}
        </div>
    `;
    
    // Setup pagination
    setupPagination(meals.length, paginationResult.totalPages);
    
    // Add event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });
    
    // Add event listeners to view recipe buttons
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mealId = this.getAttribute('data-id');
            const meal = getRecipeById(recipeData, mealId);
            if (meal) {
                showRecipeDetailModal(meal);
            }
        });
    });
}

function setupPagination(totalRecipes, totalPages) {
    if (totalPages <= 1) {
        pagination.classList.add('hidden');
        return;
    }
    
    pagination.classList.remove('hidden');
    
    // Update prev/next buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    
    // Generate page numbers
    pageNumbers.innerHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn w-10 h-10 rounded ${i === currentPage ? 'bg-[#FF7F50] text-white' : 'bg-gray-200 text-gray-700'}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => goToPage(i));
        pageNumbers.appendChild(pageBtn);
    }
}

function goToPage(page) {
    currentPage = page;
    displayRecipes(filteredRecipes);
    window.scrollTo({ top: searchResults.offsetTop - 100, behavior: 'smooth' });
}

function goToPrevPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

// Favorites Functions
function toggleFavorite(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const heartIcon = btn.querySelector('i');
    const mealId = btn.getAttribute('data-id');
    
    if (isFavorite(mealId)) {
        removeFromFavorites(mealId);
        heartIcon.style.color = 'transparent';
        heartIcon.style.webkitTextStroke = '1px #000';
        heartIcon.classList.remove('active');
    } else {
        addToFavorites(mealId);
        heartIcon.style.color = '#FF7F50';
        heartIcon.style.webkitTextStroke = '1px #FF7F50';
        heartIcon.classList.add('active');
    }
    
    // Animate the heart
    heartIcon.classList.add('heart-animation');
    setTimeout(() => {
        heartIcon.classList.remove('heart-animation');
    }, 300);
    
    // If we're on the favorites page, reload favorites
    if (!favoritesPage.classList.contains('hidden')) {
        loadFavorites();
    }
}

function loadFavorites() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        favoritesResults.innerHTML = '';
        noFavorites.classList.remove('hidden');
        return;
    }
    
    noFavorites.classList.add('hidden');
    
    // Filter recipe data to only include favorites
    const favoriteMeals = getFavoriteMeals(recipeData);
    
    if (favoriteMeals.length === 0) {
        favoritesResults.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-heart-broken text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-xl text-gray-500">Could not load your favorites</h3>
                <p class="text-gray-400 mt-2">Please try again later</p>
            </div>
        `;
        return;
    }
    
    favoritesResults.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${favoriteMeals.map(meal => createRecipeCard(meal, true)).join('')}
        </div>
    `;
    
    // Add event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });
    
    // Add event listeners to view recipe buttons
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mealId = this.getAttribute('data-id');
            const meal = getRecipeById(recipeData, mealId);
            if (meal) {
                showRecipeDetailModal(meal);
            }
        });
    });
}

// Form Handling
function handleRecipeSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = getFormData();
    
    // Create a new recipe object
    const newRecipe = {
        idMeal: '0' + (recipeData.meals.length + 1),
        strMeal: formData.name,
        strDrinkAlternate: null,
        strCategory: formData.category,
        strArea: formData.area,
        strInstructions: formData.instructions,
        strMealThumb: formData.imageUrl,
        strTags: formData.tags,
        strYoutube: "",
        strIngredient: formData.ingredients,
        strMeasure: formData.measures,
        dateModified: Date.now()
    };

    // Add to recipe data (in a real app, you would send to a server)
    recipeData.meals.push(newRecipe);
    
    // In a real app, you would submit the form data to your backend
    // For this demo, we'll just show a success message
    hideSubmitRecipeModal();
    showSuccessMessage(successMessage);
}