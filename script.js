document.addEventListener("DOMContentLoaded", () => {
    const randomDrinkBtn = document.getElementById("random-drink");
    const saveFavoriteBtn = document.getElementById("save-favorite");
    const drinkDetails = document.getElementById("drink-details");
    const loader = document.getElementById("loader");
    const favoritesList = document.getElementById("favorites");

    let currentDrink = null;

    randomDrinkBtn.addEventListener("click", async () => {
        loader.style.display = "block";
        drinkDetails.innerHTML = "";
        try {
            const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
            const data = await response.json();
            currentDrink = data.drinks[0];
            displayDrinkDetails(currentDrink);
        } catch (error) {
            console.error("Error fetching data:", error);
            drinkDetails.innerHTML = "<p>Error al cargar los datos.</p>";
        } finally {
            loader.style.display = "none";
        }
    });

    function displayDrinkDetails(drink) {
        drinkDetails.innerHTML = `
            <h3>${drink.strDrink}</h3>
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <p><strong>ID:</strong> ${drink.idDrink}</p>
            <p><strong>Categoría:</strong> ${drink.strCategory}</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
                ${getIngredients(drink).map(ing => `<li>${ing}</li>`).join("")}
            </ul>
            <p><strong>Instrucciones:</strong> ${drink.strInstructions}</p>
        `;
    }

    function getIngredients(drink) {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
            }
        }
        return ingredients;
    }

    saveFavoriteBtn.addEventListener("click", () => {
        if (currentDrink) {
            const favorites = getFavorites();
            favorites.push({ id: currentDrink.idDrink, name: currentDrink.strDrink });
            localStorage.setItem("favorites", JSON.stringify(favorites));
            displayFavorites();
        }
    });

    function getFavorites() {
        const favorites = localStorage.getItem("favorites");
        return favorites ? JSON.parse(favorites) : [];
    }

    function displayFavorites() {
        const favorites = getFavorites();
        favoritesList.innerHTML = favorites.map(fav => `<li data-id="${fav.id}">${fav.name}</li>`).join("");
    }

    favoritesList.addEventListener("click", async (event) => {
        if (event.target.tagName === "LI") {
            const drinkId = event.target.getAttribute("data-id");
            loader.style.display = "block";
            drinkDetails.innerHTML = "";
            try {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
                const data = await response.json();
                displayDrinkDetails(data.drinks[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
                drinkDetails.innerHTML = "<p>Error al cargar los datos.</p>";
            } finally {
                loader.style.display = "none";
            }
        }
    });

    displayFavorites();
});
