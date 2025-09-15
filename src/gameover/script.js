import { loadGame, saveGame } from '../src/game-state.js';

// Elementos de la interfaz
const finalScoreElement = document.getElementById('final-score');
const earnedMoneyElement = document.getElementById('earned-money');
const bestScoreElement = document.getElementById('best-score');
const totalMoneyElement = document.getElementById('total-money');
const restartButton = document.getElementById('restart-button');
const openShopButton = document.getElementById('open-shop');

// Cargar estado del juego
let game = {};
loadGame(game);

// Actualizar UI con los datos del juego
finalScoreElement.textContent = game.score || 0;
earnedMoneyElement.textContent = Math.floor(game.money || 0);
bestScoreElement.textContent = game.bestScore || 0;
totalMoneyElement.textContent = Math.floor(game.totalMoney || 0);

// Event Listeners
restartButton.addEventListener('click', function() {
    window.location.href = '../index.html';
});

openShopButton.addEventListener('click', function() {
    window.location.href = '../shop/index.html';
});