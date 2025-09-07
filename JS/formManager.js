export function addIngredientField(container) {
    const count = container.children.length + 1;
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row flex md:flex-row flex-col gap-2 mb-2';
    newRow.innerHTML = `
        <input type="text" class="ingredient-measure flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF7F50]" placeholder="Measure (e.g., 1 cup)">
        <input type="text" class="ingredient-name flex-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF7F50] form-input" placeholder="Ingredient name" required>
        <button type="button" class="remove-ingredient bg-red-500 text-white px-3 rounded hover:bg-red-600">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newRow);
    
    // Show remove buttons if there's more than one ingredient
    if (container.children.length > 1) {
        document.querySelectorAll('.remove-ingredient').forEach(btn => {
            btn.style.display = 'block';
        });
    }
    
    return newRow;
}

export function addInstructionField(container) {
    const count = container.children.length + 1;
    const newRow = document.createElement('div');
    newRow.className = 'instruction-row flex gap-2 mb-2';
    newRow.innerHTML = `
        <span class="bg-[#FF7F50] text-white rounded-full w-6 h-6 flex items-center justify-center mt-2 flex-shrink-0">${count}</span>
        <textarea class="instruction-step w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF7F50] form-input" rows="2" placeholder="Instruction step" required></textarea>
        <button type="button" class="remove-instruction bg-red-500 text-white px-3 rounded hover:bg-red-600 self-start mt-2">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newRow);
    
    // Show remove buttons if there's more than one instruction
    if (container.children.length > 1) {
        document.querySelectorAll('.remove-instruction').forEach(btn => {
            btn.style.display = 'block';
        });
    }
    
    return newRow;
}

export function updateInstructionNumbers(container) {
    container.querySelectorAll('.instruction-row').forEach((row, index) => {
        row.querySelector('span').textContent = index + 1;
    });
}

export function validateForm() {
    let isValid = true;
    
    // Validate required fields
    document.querySelectorAll('.form-input').forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('shake');
            input.nextElementSibling?.classList.remove('hidden');
            isValid = false;
            
            setTimeout(() => {
                input.classList.remove('shake');
            }, 500);
        } else {
            input.classList.remove('shake');
            input.nextElementSibling?.classList.add('hidden');
        }
    });
    
    // Validate ingredients
    const ingredientNames = document.querySelectorAll('.ingredient-name');
    let hasIngredients = false;
    ingredientNames.forEach(input => {
        if (input.value.trim()) {
            hasIngredients = true;
        }
    });
    
    if (!hasIngredients) {
        document.getElementById('ingredients-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('ingredients-error').classList.add('hidden');
    }
    
    // Validate instructions
    const instructionSteps = document.querySelectorAll('.instruction-step');
    let hasInstructions = false;
    instructionSteps.forEach(input => {
        if (input.value.trim()) {
            hasInstructions = true;
        }
    });
    
    if (!hasInstructions) {
        document.getElementById('instructions-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('instructions-error').classList.add('hidden');
    }
    
    return isValid;
}

export function getFormData() {
    const ingredients = [];
    const measures = [];
    
    document.querySelectorAll('.ingredient-row').forEach(row => {
        const measure = row.querySelector('.ingredient-measure').value.trim();
        const ingredient = row.querySelector('.ingredient-name').value.trim();
        
        if (ingredient) {
            ingredients.push(ingredient);
            measures.push(measure);
        }
    });
    
    const instructions = [];
    document.querySelectorAll('.instruction-step').forEach((step, index) => {
        const instruction = step.value.trim();
        if (instruction) {
            instructions.push(instruction);
        }
    });
    
    return {
        name: document.getElementById('recipe-name').value.trim(),
        category: document.getElementById('category').value,
        area: document.getElementById('area').value.trim(),
        imageUrl: document.getElementById('image-url').value.trim(),
        tags: document.getElementById('tags').value.trim(),
        ingredients,
        measures,
        instructions
    };
}