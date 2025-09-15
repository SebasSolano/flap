export function renderAbilities(container, game) {
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
        `;

    item.addEventListener("click", function () {
      if (this.classList.contains("disabled")) return;
      buyUpgrade(ability.id, game);
    });

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
    window.location.reload();
  } else {
    alert("¡No tienes suficiente dinero!");
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
