import { saveGame, loadGame } from "./game-state.js";
import {
  showGameOverScreen,
  setupGameOverEvents,
} from "./components/gameover.js";
import {
  showShopScreen,
  setupShopEvents,
  renderShop,
} from "./components/shop.js";

// Variables del juego
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas
function resizeCanvas() {
  const container = document.getElementById("game-container");
  const size = Math.min(container.clientWidth, container.clientHeight);
  canvas.width = size;
  canvas.height = size;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Elementos de la interfaz
const scoreElement = document.getElementById("score");
const moneyElement = document.getElementById("money");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const shopScreen = document.getElementById("shop-screen");
const startButton = document.getElementById("start-button");
const openShopButton = document.getElementById("open-shop-button");

// Elementos de audio
const jumpSound = document.getElementById("jump-sound");
const hitSound = document.getElementById("hit-sound");
const scoreSound = document.getElementById("score-sound");
const ambientSound = document.getElementById("ambient-sound");

// Configurar sonidos con archivos locales
jumpSound.src = "sounds/jump.mp3";
hitSound.src = "sounds/hit.mp3";
scoreSound.src = "sounds/score.mp3";
ambientSound.src = "sounds/ambient.mp3";

// Imágenes
const birdImages = {
  skin1: new Image(),
  skin2: new Image(),
  skin3: new Image(),
  skin4: new Image(),
};

// Cargar imágenes de pájaros
birdImages.skin1.src = "images/bird-default.png";
birdImages.skin2.src = "images/bird-silver.png";
birdImages.skin3.src = "images/bird-gold.png";
birdImages.skin4.src = "images/bird-diamond.png";

// Fondos
const backgroundImages = {
  skin1: new Image(),
  skin2: new Image(),
  skin3: new Image(),
  skin4: new Image(),
};

// Cargar imágenes de fondo
backgroundImages.skin1.src = "images/background-default.png";

// Estado del juego
let game = {
  running: false,
  score: 0,
  money: 0,
  totalMoney: 0,
  bestScore: 0,
  gravity: 0.25,
  speed: 2,
  jump: 4.6,
  moneyMultiplier: 1,
  pipeGap: 150,
  skinMultiplier: 1,
  currentSkin: "skin1",
  upgrades: {
    gravity: 1,
    speed: 1,
    jump: 1,
    money: 1,
    gap: 1,
  },
  skins: {
    skin1: { purchased: true, multiplier: 1.0 },
    skin2: { purchased: false, multiplier: 1.2 },
    skin3: { purchased: false, multiplier: 1.5 },
    skin4: { purchased: false, multiplier: 2.0 },
  },
  costs: {
    gravity: 50,
    speed: 75,
    jump: 100,
    money: 150,
    gap: 200,
    skin2: 300,
    skin3: 600,
    skin4: 1000,
  },
};

// Pájaro
let bird = {
  x: canvas.width * 0.2,
  y: canvas.height / 2,
  width: canvas.width * 0.08,
  height: canvas.width * 0.08,
  velocity: 0,
  jumpStrength: game.jump,
  draw: function () {
    const img = birdImages[game.currentSkin];
    if (img && img.complete) {
      // Calcular dimensiones proporcionales
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      let drawWidth = this.width;
      let drawHeight = drawWidth / aspectRatio;

      ctx.drawImage(
        img,
        this.x - drawWidth / 2,
        this.y - drawHeight / 2,
        drawWidth,
        drawHeight
      );
    }
  },
  update: function () {
    this.velocity += game.gravity;
    this.y += this.velocity;

    // Limitar el pájaro dentro del canvas
    if (this.y >= canvas.height - this.height / 2) {
      this.y = canvas.height - this.height / 2;
      gameOver();
    }

    if (this.y <= this.height / 2) {
      this.y = this.height / 2;
      this.velocity = 0;
    }
  },
  flap: function () {
    this.velocity = -this.jumpStrength;
    // Reproducir sonido de salto
    jumpSound.currentTime = 0;
    jumpSound.play().catch(function (e) {
      console.log("Error al reproducir sonido de salto: ", e);
    });
  },
};

// Tubos
let pipes = [];
let pipeWidth = canvas.width * 0.1;
let pipeSpawnInterval = 1500; // ms
let lastPipeSpawn = 0;

function Pipe() {
  this.x = canvas.width;
  this.width = pipeWidth;
  this.gapHeight = game.pipeGap * (canvas.width / 360);
  this.gapPosition =
    Math.random() * (canvas.height - this.gapHeight - 100) + 50;
  this.scored = false;
  this.topPipeHeight = this.gapPosition;
  this.bottomPipeY = this.gapPosition + this.gapHeight;

  this.draw = function () {
    ctx.fillStyle = "#2ecc71";

    // Tubo superior
    ctx.fillRect(this.x, 0, this.width, this.topPipeHeight);

    // Tubo inferior
    ctx.fillRect(
      this.x,
      this.bottomPipeY,
      this.width,
      canvas.height - this.bottomPipeY
    );

    // Bordes de los tubos
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(this.x - 2, this.topPipeHeight - 10, this.width + 4, 10);
    ctx.fillRect(this.x - 2, this.bottomPipeY, this.width + 4, 10);
  };

  this.update = function () {
    this.x -= game.speed;

    // Comprobar si el pájaro ha pasado el tubo
    if (!this.scored && this.x + this.width < bird.x) {
      game.score++;
      game.money += 5 * game.moneyMultiplier;
      updateUI();
      this.scored = true;

      // Reproducir sonido de puntuación
      scoreSound.currentTime = 0;
      scoreSound.play().catch(function (e) {
        console.log("Error al reproducir sonido de puntuación: ", e);
      });
    }

    // Comprobar colisión
    if (
      bird.x + bird.width / 2 > this.x &&
      bird.x - bird.width / 2 < this.x + this.width &&
      (bird.y - bird.height / 2 < this.topPipeHeight ||
        bird.y + bird.height / 2 > this.bottomPipeY)
    ) {
      gameOver();
    }
  };
}

// Fondo
function drawBackground() {
  const bgImg = backgroundImages.skin1;

  if (bgImg && bgImg.complete) {
    // Dibujar imagen de fondo
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }
}

// Iniciar juego
function startGame() {
  game.running = true;
  game.score = 0;
  game.money = 0;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  bird.jumpStrength = game.jump * game.skinMultiplier;
  pipes = [];
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  shopScreen.classList.add("hidden");
  updateUI();

  // Ajustar tamaño de elementos basado en el canvas
  bird.width = canvas.width * 0.08;
  bird.height = canvas.width * 0.08;
  pipeWidth = canvas.width * 0.1;

  // Iniciar sonido ambiente
  ambientSound.currentTime = 0;
  ambientSound.play().catch(function (e) {
    console.log("Error al reproducir sonido ambiente: ", e);
  });

  gameLoop();
}

// Game over
function gameOver() {
  game.running = false;

  // Detener sonido ambiente
  ambientSound.pause();

  // Reproducir sonido de choque
  hitSound.currentTime = 0;
  hitSound.play().catch(function (e) {
    console.log("Error al reproducir sonido de choque: ", e);
  });

  // Actualizar mejores puntuaciones y dinero total
  if (game.score > game.bestScore) {
    game.bestScore = game.score;
  }

  game.totalMoney += game.money;

  // Guardar en localStorage
  saveGame(game);

  // Mostrar pantalla de game over
  showGameOverScreen(game);
}

// Actualizar UI
function updateUI() {
  scoreElement.textContent = game.score;
  moneyElement.textContent = Math.floor(game.money);
}

// Bucle principal del juego
function gameLoop(timestamp) {
  if (!game.running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  // Generar nuevos tubos
  if (timestamp - lastPipeSpawn > pipeSpawnInterval) {
    pipes.push(new Pipe());
    lastPipeSpawn = timestamp;
  }

  // Actualizar y dibujar tubos
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].draw();

    // Eliminar tubos que salieron de la pantalla
    if (pipes[i].x + pipes[i].width < 0) {
      pipes.splice(i, 1);
    }
  }

  // Actualizar y dibujar pájaro
  bird.update();
  bird.draw();

  requestAnimationFrame(gameLoop);
}

// Event Listeners
startButton.addEventListener("click", startGame);

openShopButton.addEventListener("click", function () {
  showShopScreen(game);
  shopScreen.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
});

// Configurar eventos de los componentes
setupGameOverEvents(startGame, function () {
  showShopScreen(game);
  shopScreen.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
});

setupShopEvents(function () {
  shopScreen.classList.add("hidden");
  if (!game.running) {
    gameOverScreen.classList.remove("hidden");
  }
});

// Controles
canvas.addEventListener("click", function () {
  if (game.running) {
    bird.flap();
  } else if (startScreen.classList.contains("hidden")) {
    startGame();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (game.running) {
      bird.flap();
      e.preventDefault();
    } else if (startScreen.classList.contains("hidden")) {
      startGame();
    }
  }
});

// Inicializar juego
loadGame(game);
updateUI();
