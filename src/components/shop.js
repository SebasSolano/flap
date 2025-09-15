import { saveGame } from "../game-state.js";

// Elementos de la interfaz
const closeShopButton = document.getElementById("close-shop-button");
const categoryButtons = document.querySelectorAll(".category-btn");
const shopItems = document.querySelector(".shop-items");
const shopScreen = document.getElementById("shop-screen");

let currentGame = {};

export function showShopScreen(game) {
  currentGame = game;
  renderShop("abilities", game);
  shopScreen.classList.remove("hidden");
}

export function setupShopEvents(closeShopCallback) {
  closeShopButton.addEventListener("click", closeShopCallback);

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      categoryButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Recargar la tienda con la categoría seleccionada
      renderShop(category, currentGame);
    });
  });
}

export function renderShop(category, game) {
  shopItems.innerHTML = "";

  if (category === "abilities") {
    renderAbilities(shopItems, game);
  } else if (category === "skins") {
    renderSkins(shopItems, game);
  }
}

function renderAbilities(container, game) {
  const abilities = [
    {
      id: "gravity",
      name: "Gravedad Reducida",
      description: "El pájaro cae más lentamente",
      effect: "Reduce la gravedad en un 10%",
      cost: game.costs.gravity,
      level: game.upgrades.gravity,
    },
    {
      id: "speed",
      name: "Velocidad",
      description: "Aumenta la velocidad del juego",
      effect: "Aumenta la velocidad en 0.5 unidades",
      cost: game.costs.speed,
      level: game.upgrades.speed,
    },
    {
      id: "jump",
      name: "Salto Mejorado",
      description: "El pájaro salta más alto",
      effect: "Aumenta la fuerza de salto en 0.5 unidades",
      cost: game.costs.jump,
      level: game.upgrades.jump,
    },
    {
      id: "money",
      name: "Dinero Extra",
      description: "Gana más dinero por punto",
      effect: "Aumenta el multiplicador de dinero en 0.2",
      cost: game.costs.money,
      level: game.upgrades.money,
    },
    {
      id: "gap",
      name: "Espacio Extra",
      description: "Aumenta el espacio entre tubos",
      effect: "Aumenta el espacio entre tubos en 10 píxeles",
      cost: game.costs.gap,
      level: game.upgrades.gap,
    },
  ];

  abilities.forEach((ability) => {
    const item = document.createElement("div");
    item.className = `shop-item ${
      game.totalMoney < ability.cost ? "disabled" : ""
    }`;
    item.setAttribute("data-category", "abilities");
    item.setAttribute("data-upgrade", ability.id);

    item.innerHTML = `
            <h3>${ability.name}</h3>
            <p>${ability.description}</p>
            <p class="effect">${ability.effect}</p>
            <p class="effect">Multiplicador de skin: <span class="multiplier">x${game.skinMultiplier.toFixed(
              1
            )}</span></p>
            <div class="upgrade-info">
                <span class="cost">Coste: $<span id="${ability.id}-cost">${
      ability.cost
    }</span></span>
                <span class="level">Nivel: <span id="${ability.id}-level">${
      ability.level
    }</span></span>
            </div>
            <button class="buy-button">Comprar</button>
        `;

    const buyButton = item.querySelector(".buy-button");
    buyButton.addEventListener("click", function () {
      if (!item.classList.contains("disabled")) {
        buyUpgrade(ability.id, game);
      }
    });

    container.appendChild(item);
  });
}

function renderSkins(container, game) {
  const skins = [
    {
      id: "skin1",
      name: "Skin Básica",
      description: "Skin inicial con multiplicador estándar",
      effect: "Multiplicador x1.0 para todas las habilidades",
      cost: 0,
      purchased: game.skins.skin1.purchased,
      multiplier: 1.0,
    },
    {
      id: "skin2",
      name: "Skin Plateada",
      description: "Skin plateada con multiplicador x1.2",
      effect: "Multiplicador x1.2 para todas las habilidades",
      cost: game.costs.skin2,
      purchased: game.skins.skin2.purchased,
      multiplier: 1.2,
    },
    {
      id: "skin3",
      name: "Skin Dorada",
      description: "Skin dorada con multiplicador x1.5",
      effect: "Multiplicador x1.5 para todas las habilidades",
      cost: game.costs.skin3,
      purchased: game.skins.skin3.purchased,
      multiplier: 1.5,
    },
    {
      id: "skin4",
      name: "Skin Diamante",
      description: "Skin diamante con multiplicador x2.0",
      effect: "Multiplicador x2.0 para todas las habilidades",
      cost: game.costs.skin4,
      purchased: game.skins.skin4.purchased,
      multiplier: 2.0,
    },
  ];

  skins.forEach((skin) => {
    const item = document.createElement("div");
    const isDisabled = !skin.purchased && game.totalMoney < skin.cost;
    item.className = `shop-item ${isDisabled ? "disabled" : ""}`;
    item.setAttribute("data-category", "skins");
    item.setAttribute("data-upgrade", skin.id);

    item.innerHTML = `
            <h3>${skin.name}</h3>
            <p>${skin.description}</p>
            <p class="effect">${skin.effect}</p>
            <div class="upgrade-info">
                <span class="cost">Coste: $<span id="${skin.id}-cost">${
      skin.purchased ? "Adquirida" : skin.cost
    }</span></span>
                <span class="level">${
                  skin.purchased
                    ? game.currentSkin === skin.id
                      ? "Equipada"
                      : "Disponible"
                    : "No adquirida"
                }</span>
            </div>
            ${
              !skin.purchased || game.currentSkin !== skin.id
                ? '<button class="buy-button">' +
                  (skin.purchased ? "Equipar" : "Comprar") +
                  "</button>"
                : ""
            }
        `;

    const buyButton = item.querySelector(".buy-button");
    if (buyButton) {
      buyButton.addEventListener("click", function () {
        if (!item.classList.contains("disabled")) {
          buySkin(skin.id, game);
        }
      });
    }

    container.appendChild(item);
  });
}

function buyUpgrade(upgradeType, game) {
  const cost = game.costs[upgradeType];

  if (game.totalMoney >= cost) {
    game.totalMoney -= cost;
    game.upgrades[upgradeType]++;

    // Aplicar mejora
    applyUpgrade(upgradeType, game);

    // Aumentar costo para próxima mejora
    game.costs[upgradeType] = Math.floor(cost * 1.5);

    // Guardar en localStorage
    saveGame(game);

    // Recargar la tienda
    renderShop(
      document
        .querySelector(".category-btn.active")
        .getAttribute("data-category"),
      game
    );
  } else {
    alert("¡No tienes suficiente dinero!");
  }
}

function buySkin(skinId, game) {
  if (game.skins[skinId].purchased) {
    // Equipar la skin
    game.currentSkin = skinId;
    game.skinMultiplier = game.skins[skinId].multiplier;
    saveGame(game);

    // Recargar la tienda
    renderShop("skins", game);
  } else {
    // Comprar la skin
    const cost = game.costs[skinId];
    if (game.totalMoney >= cost) {
      game.totalMoney -= cost;
      game.skins[skinId].purchased = true;
      game.currentSkin = skinId;
      game.skinMultiplier = game.skins[skinId].multiplier;
      saveGame(game);

      // Recargar la tienda
      renderShop("skins", game);
    } else {
      alert("¡No tienes suficiente dinero!");
    }
  }
}

function applyUpgrade(upgradeType, game) {
  switch (upgradeType) {
    case "gravity":
      game.gravity =
        0.25 * Math.pow(0.9, game.upgrades.gravity - 1) * game.skinMultiplier;
      break;
    case "speed":
      game.speed = (2 + 0.5 * (game.upgrades.speed - 1)) * game.skinMultiplier;
      break;
    case "jump":
      game.jump = (4.6 + 0.5 * (game.upgrades.jump - 1)) * game.skinMultiplier;
      break;
    case "money":
      game.moneyMultiplier =
        1 + 0.2 * (game.upgrades.money - 1) * game.skinMultiplier;
      break;
    case "gap":
      game.pipeGap = 150 + 10 * (game.upgrades.gap - 1) * game.skinMultiplier;
      break;
  }
}
