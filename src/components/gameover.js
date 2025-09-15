import { saveGame } from "../game-state.js";

// Elementos de la interfaz
const finalScoreElement = document.getElementById("final-score");
const earnedMoneyElement = document.getElementById("earned-money");
const bestScoreElement = document.getElementById("best-score");
const totalMoneyElement = document.getElementById("total-money");
const restartButton = document.getElementById("restart-button");
const openShopButton = document.getElementById("open-shop-button");
const gameOverScreen = document.getElementById("game-over-screen");

export function showGameOverScreen(game) {
  finalScoreElement.textContent = game.score || 0;
  earnedMoneyElement.textContent = Math.floor(game.money || 0);
  bestScoreElement.textContent = game.bestScore || 0;
  totalMoneyElement.textContent = Math.floor(game.totalMoney || 0);

  gameOverScreen.classList.remove("hidden");
}

export function setupGameOverEvents(startGameCallback, openShopCallback) {
  restartButton.addEventListener("click", function () {
    gameOverScreen.classList.add("hidden");
    startGameCallback();
  });

  openShopButton.addEventListener("click", openShopCallback);
}
