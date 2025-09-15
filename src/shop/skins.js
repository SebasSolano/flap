export function renderSkins(container, game) {
  const skins = [
    {
      id: "skin1",
      name: "Skin Básica",
      color: "#f1c40f",
      description: "Skin inicial con multiplicador estándar",
      effect: "Multiplicador x1.0 para todas las habilidades",
      cost: 0,
      purchased: game.skins.skin1.purchased,
      multiplier: 1.0,
    },
    {
      id: "skin2",
      name: "Skin Plateada",
      color: "#bdc3c7",
      description: "Skin plateada con multiplicador x1.2",
      effect: "Multiplicador x1.2 para todas las habilidades",
      cost: game.costs.skin2,
      purchased: game.skins.skin2.purchased,
      multiplier: 1.2,
    },
    {
      id: "skin3",
      name: "Skin Dorada",
      color: "#ffd700",
      description: "Skin dorada con multiplicador x1.5",
      effect: "Multiplicador x1.5 para todas las habilidades",
      cost: game.costs.skin3,
      purchased: game.skins.skin3.purchased,
      multiplier: 1.5,
    },
    {
      id: "skin4",
      name: "Skin Diamante",
      color: "#00b4ff",
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
            <h3>${skin.name} <span class="skin-preview" style="background: ${
      skin.color
    }"></span></h3>
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
        `;

    item.addEventListener("click", function () {
      if (this.classList.contains("disabled")) return;
      buySkin(skin.id, game);
    });

    container.appendChild(item);
  });
}

function buySkin(skinId, game) {
  if (game.skins[skinId].purchased) {
    // Equipar la skin
    game.currentSkin = skinId;
    game.skinMultiplier = game.skins[skinId].multiplier;
    saveGame(game);
    window.location.reload();
  } else {
    // Comprar la skin
    const cost = game.costs[skinId];
    if (game.totalMoney >= cost) {
      game.totalMoney -= cost;
      game.skins[skinId].purchased = true;
      game.currentSkin = skinId;
      game.skinMultiplier = game.skins[skinId].multiplier;
      saveGame(game);
      window.location.reload();
    } else {
      alert("¡No tienes suficiente dinero!");
    }
  }
}
