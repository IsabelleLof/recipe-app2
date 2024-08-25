// Tasks that are left to do:

// - Add an image to each recipe

// - Grade a recipe that is created - Isabelle

// - Use Async/Await in our code

// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Get references to various DOM elements
  const form = document.getElementById("recipe-form");
  const titleInput = document.getElementById("title");
  const ingredientsInput = document.getElementById("ingredients");
  const instructionsInput = document.getElementById("instructions");
  const recipeList = document.getElementById("recipe-list");
  const recipeIdInput = document.getElementById("recipe-id");
  const submitBtn = document.getElementById("submit-btn");
  const imgUploadBtn = document.getElementById("upploadBtn");
  const imgSrc = document.getElementById("emptyPhoto");
  let imageUrl = "";

  // Initialize the recipes array from localStorage or an empty array if not present
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  // Function to render the list of recipes to the DOM
  function renderRecipes() {
    // Clear the existing list
    recipeList.innerHTML = "";

    // Loop through each recipe and create the corresponding HTML elements
    recipes.forEach((recipe, index) => {
      // Create a new list item
      const li = document.createElement("li");
      li.innerHTML = `
                <div>
                <img src="${recipe.imageUrl}" alt="${
        recipe.title
      }" style="width:100px;height:auto;">
                    <strong>${recipe.title}</strong>
                    <p><em>Ingredients:</em> ${recipe.ingredients}</p>
                    <p><em>Instructions:</em> ${recipe.instructions}</p>
                    <p><em>Rating:</em> ${renderStars(recipe.rating)}</p>
                </div>
                <div>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
      // Append the list item to the recipe list
      recipeList.appendChild(li);
    });
  }

  // Function to import image
  imgUploadBtn.onchange = function () {
    imageUrl = URL.createObjectURL(imgUploadBtn.files[0]);
    imgSrc.src = imageUrl;
  };

  // Function to render stars based on the rating
  function renderStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += "★"; // filled star
      } else {
        stars += "☆"; // empty star
      }
    }
    return stars;
  }

  // Function to reset the form inputs to their default state
  function resetForm() {
    // Clear the input fields and reset the form state
    titleInput.value = "";
    ingredientsInput.value = "";
    instructionsInput.value = "";
    recipeIdInput.value = "";
    document.querySelector('input[name="rating"]:checked').checked = false; // Reset the rating
    submitBtn.textContent = "Add Recipe";
    imageUrl = "";
    imgSrc.src = "img/emptyplate.png";
  }

  // Event listener for form submission
  form.addEventListener("submit", (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Get the values from the form inputs
    const title = titleInput.value;
    const ingredients = ingredientsInput.value;
    const instructions = instructionsInput.value;
    const rating = document.querySelector('input[name="rating"]:checked').value; // Get the rating value
    const id = recipeIdInput.value;

    // If an ID exists, update the existing recipe; otherwise, add a new one
    if (id) {
      recipes[id] = { title, ingredients, instructions, rating };
    } else {
      recipes.push({ title, ingredients, instructions, rating });
    }

    // Save the updated recipes array to localStorage
    localStorage.setItem("recipes", JSON.stringify(recipes));

    // Re-render the recipe list and reset the form
    renderRecipes();
    resetForm();
  });

  // Event listener for clicks on the recipe list (for edit/delete actions)
  recipeList.addEventListener("click", (e) => {
    // If the delete button was clicked
    if (e.target.classList.contains("delete-btn")) {
      // Get the index of the recipe to delete and remove it from the array
      const index = e.target.dataset.index;
      recipes.splice(index, 1);

      // Update localStorage and re-render the list
      localStorage.setItem("recipes", JSON.stringify(recipes));
      renderRecipes();
    }

    // If the edit button was clicked
    if (e.target.classList.contains("edit-btn")) {
      // Get the index of the recipe to edit and populate the form with its data
      const index = e.target.dataset.index;
      const recipe = recipes[index];
      titleInput.value = recipe.title;
      ingredientsInput.value = recipe.ingredients;
      instructionsInput.value = recipe.instructions;
      recipeIdInput.value = index;

      // Set the rating value
      document.querySelector(
        `input[name="rating"][value="${recipe.rating}"]`
      ).checked = true;

      submitBtn.textContent = "Update Recipe";
    }
  });

  // Initial rendering of the recipes when the page loads
  renderRecipes();
});
