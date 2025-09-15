// Guardar juego
export function saveGame(game) {
  const saveData = {
    totalMoney: game.totalMoney,
    bestScore: game.bestScore,
    upgrades: game.upgrades,
    costs: game.costs,
    skins: game.skins,
    currentSkin: game.currentSkin,
    skinMultiplier: game.skinMultiplier,
    score: game.score,
    money: game.money,
  };

  localStorage.setItem("flappyBirdSave", JSON.stringify(saveData));
}

// Cargar juego
export function loadGame(game) {
  const saveData = JSON.parse(localStorage.getItem("flappyBirdSave"));

  if (saveData) {
    game.totalMoney = saveData.totalMoney || 0;
    game.bestScore = saveData.bestScore || 0;
    game.upgrades = saveData.upgrades || game.upgrades;
    game.costs = saveData.costs || game.costs;
    game.skins = saveData.skins || game.skins;
    game.currentSkin = saveData.currentSkin || "skin1";
    game.skinMultiplier = saveData.skinMultiplier || 1;
    game.score = saveData.score || 0;
    game.money = saveData.money || 0;
  }

  return game;
}
