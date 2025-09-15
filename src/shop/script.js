import { loadGame, saveGame } from "../src/game-state.js";
import { renderAbilities } from "./abilities.js";
import { renderSkins } from "./skins.js";

// Elementos de la interfaz
const closeShopButton = document.getElementById("close-shop");
const categoryButtons = document.querySelectorAll(".category-btn");
const shopItems = document.querySelector(".shop-items");

// Cargar estado del juego
let game = {};
loadGame(game);

// Filtrar items de la tienda por categoría
function filterShop(category) {
  shopItems.innerHTML = "";

  if (category === "abilities") {
    renderAbilities(shopItems, game);
  } else if (category === "skins") {
    renderSkins(shopItems, game);
  }

  // Actualizar botones de categoría
  categoryButtons.forEach((btn) => {
    if (btn.getAttribute("data-category") === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Event Listeners
closeShopButton.addEventListener("click", function () {
  window.location.href = "../index.html";
});

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    const category = this.getAttribute("data-category");
    filterShop(category);
  });
});

// Inicializar tienda
filterShop("abilities");
