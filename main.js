// Espera a que el DOM se cargue
window.addEventListener("DOMContentLoaded", () => {
  /* ==============================
     Código Principal y Fondo
  ============================== */
  const intro = document.querySelector(".intro-screen");
  const mainContent = document.querySelector(".main-content");
  const disconnectScreen = document.querySelector(".disconnect-screen");
  const startupSound = document.getElementById("startup");
  const disconnectSound = document.getElementById("disconnect-audio");
  const disconnectBtn = document.getElementById("disconnect");

  // Reproducción de audio y transición de pantallas
  if (startupSound) {
    startupSound.play().catch(err => console.warn("AutoPlay bloqueado:", err));
  }
  setTimeout(() => {
    intro.classList.add("hidden");
    mainContent.classList.remove("hidden");
  }, 4000);

  if (disconnectBtn && disconnectScreen && mainContent && disconnectSound) {
    disconnectBtn.addEventListener("click", (e) => {
      e.preventDefault();
      mainContent.classList.add("hidden");
      disconnectScreen.classList.remove("hidden");
      disconnectSound.play().catch(err => console.warn("No se pudo reproducir:", err));
    });
  }

  /* ==============================
     Reloj Minimalista
  ============================== */
  const clockElement = document.getElementById("clock");
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
  }
  updateClock();
  setInterval(updateClock, 60000);

  /* ==============================
       Juego "Dino Loco"
  ============================== */
  const gameCanvas = document.getElementById("gameCanvas");
  const gameCtx = gameCanvas.getContext("2d");
  let gameLoopId;
  let gameRunning = false;
  let gamePaused = false;
  let score = 0;
  let dino, cactus;

  function resizeGameCanvas() {
    // Ajusta el ancho al contenedor del juego y fija una altura
    gameCanvas.width = document.getElementById("dinoGameSection").clientWidth;
    gameCanvas.height = 150;
  }
  resizeGameCanvas();
  window.addEventListener("resize", resizeGameCanvas);

  function initGame() {
    dino = { x: 50, y: 100, width: 20, height: 20, vy: 0, jumpForce: 10, gravity: 0.5, onGround: true };
    cactus = { x: gameCanvas.width, y: 110, width: 20, height: 30, speed: 5 };
    score = 0;
    gamePaused = false;
    hideScoreScreen();
  }

  function updateGame() {
    if (!gameRunning || gamePaused) return;
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Física del Dino
    if (!dino.onGround) {
      dino.vy -= dino.gravity;
      dino.y -= dino.vy;
      if (dino.y >= 100) {
        dino.y = 100;
        dino.onGround = true;
        dino.vy = 0;
      }
    }

    // Movimiento del cactus
    cactus.x -= cactus.speed;
    if (cactus.x + cactus.width < 0) {
      cactus.x = gameCanvas.width + Math.random() * 100;
      score += 1;
    }

    // Dibuja línea de suelo
    gameCtx.strokeStyle = "#444";
    gameCtx.beginPath();
    gameCtx.moveTo(0, 120);
    gameCtx.lineTo(gameCanvas.width, 120);
    gameCtx.stroke();

    // Dibuja al Dino
    gameCtx.fillStyle = "#9cf";
    gameCtx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Dibuja el cactus
    gameCtx.fillStyle = "#f55";
    gameCtx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);

    // Dibuja el puntaje
    gameCtx.fillStyle = "#e0e0e0";
    gameCtx.font = "16px Arial";
    gameCtx.fillText("Puntos: " + score, gameCanvas.width - 120, 20);

    // Verifica colisión
    if (
      dino.x < cactus.x + cactus.width &&
      dino.x + dino.width > cactus.x &&
      dino.y < cactus.y + cactus.height &&
      dino.y + dino.height > cactus.y
    ) {
      endGame();
      return;
    }
    gameLoopId = requestAnimationFrame(updateGame);
  }

  function startGame() {
    if (!gameRunning) {
      gameRunning = true;
      initGame();
      gameLoopId = requestAnimationFrame(updateGame);
    } else if (gamePaused) {
      gamePaused = false;
      gameLoopId = requestAnimationFrame(updateGame);
    }
  }

  function pauseGame() {
    gamePaused = true;
    cancelAnimationFrame(gameLoopId);
  }

  function resetGame() {
    gameRunning = false;
    cancelAnimationFrame(gameLoopId);
    initGame();
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    hideScoreScreen();
  }

  function endGame() {
    gameRunning = false;
    cancelAnimationFrame(gameLoopId);
    showScoreScreen();
  }

  function showScoreScreen() {
    document.getElementById("finalScore").textContent = score;
    document.getElementById("scoreScreen").style.display = "block";
  }

  function hideScoreScreen() {
    document.getElementById("scoreScreen").style.display = "none";
  }

  document.getElementById("playBtn").addEventListener("click", startGame);
  document.getElementById("pauseBtn").addEventListener("click", pauseGame);
  document.getElementById("restartBtn").addEventListener("click", () => {
    resetGame();
    startGame();
  });

  // Salto del Dino con la barra espaciadora
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && dino && dino.onGround && gameRunning && !gamePaused) {
      dino.onGround = false;
      dino.vy = dino.jumpForce;
    }
  });

  /* ==============================
       Poema Random para Protocolos
  ============================== */
  const poemas = [
    "Entre sombras y luces se esconde el misterio, un susurro del tiempo, un eco en el vacío.",
    "La noche susurra secretos al viento, y en cada estrella se guarda un deseo.",
    "El silencio del cosmos revela historias olvidadas, entre destellos y anhelos perdidos."
  ];
  // Selecciona un poema al azar
  const poemaElement = document.getElementById("poema");
  poemaElement.textContent = poemas[Math.floor(Math.random() * poemas.length)];
});

// Acción para el botón del enigma
document.querySelector(".enigma").addEventListener("click", () => {
  window.location.href = "lost_signal.html"; // Cambia la ruta según necesites
});



/* ========== Juego de las Naves ========= */
const naveCanvas = document.getElementById("naveCanvas");
const naveCtx = naveCanvas.getContext("2d");

let naveLoopId;
let naveRunning = false;
let navePaused = false;
let naveScore = 0;

let nave, projectiles = [], enemies = [];

function resizeNaveCanvas() {
  naveCanvas.width = document.getElementById("naveGameSection").clientWidth;
  naveCanvas.height = 300;
}
resizeNaveCanvas();
window.addEventListener("resize", resizeNaveCanvas);

function initNaveGame() {
  nave = { x: 50, y: naveCanvas.height / 2 - 15, width: 20, height: 30 };
  projectiles = [];
  enemies = [];
  naveScore = 0;
  navePaused = false;
  hideNaveScoreScreen();
}

function spawnEnemy() {
  enemies.push({
    x: naveCanvas.width,
    y: Math.random() * (naveCanvas.height - 30),
    width: 30,
    height: 30,
    speed: 3 + Math.random() * 2
  });
}

function updateNaveGame() {
  if (!naveRunning || navePaused) return;
  naveCtx.clearRect(0, 0, naveCanvas.width, naveCanvas.height);

  // Nave
  naveCtx.fillStyle = "#0ff";
  naveCtx.fillRect(nave.x, nave.y, nave.width, nave.height);

  // Proyectiles
  projectiles.forEach((p, i) => {
    p.x += p.speed;
    naveCtx.fillStyle = "#fff";
    naveCtx.fillRect(p.x, p.y, p.width, p.height);
    if (p.x > naveCanvas.width) projectiles.splice(i, 1);
  });

  // Enemigos
  enemies.forEach((e, i) => {
    e.x -= e.speed;
    naveCtx.fillStyle = "#f55";
    naveCtx.fillRect(e.x, e.y, e.width, e.height);

    // Colisión con proyectil
    projectiles.forEach((p, j) => {
      if (
        p.x < e.x + e.width &&
        p.x + p.width > e.x &&
        p.y < e.y + e.height &&
        p.y + p.height > e.y
      ) {
        enemies.splice(i, 1);
        projectiles.splice(j, 1);
        naveScore += 10;
      }
    });

    // Colisión con la nave
    if (
      nave.x < e.x + e.width &&
      nave.x + nave.width > e.x &&
      nave.y < e.y + e.height &&
      nave.y + nave.height > e.y
    ) {
      endNaveGame();
    }

    // Sale de pantalla
    if (e.x + e.width < 0) enemies.splice(i, 1);
  });

  // Score
  naveCtx.fillStyle = "#0f0";
  naveCtx.font = "14px monospace";
  naveCtx.fillText("Puntos: " + naveScore, naveCanvas.width - 100, 20);

  // Spawning
  if (Math.random() < 0.02) spawnEnemy();

  naveLoopId = requestAnimationFrame(updateNaveGame);
}

function startNaveGame() {
  if (!naveRunning) {
    naveRunning = true;
    initNaveGame();
    naveLoopId = requestAnimationFrame(updateNaveGame);
  } else if (navePaused) {
    navePaused = false;
    naveLoopId = requestAnimationFrame(updateNaveGame);
  }
}

function pauseNaveGame() {
  navePaused = true;
  cancelAnimationFrame(naveLoopId);
}

function resetNaveGame() {
  naveRunning = false;
  cancelAnimationFrame(naveLoopId);
  initNaveGame();
  naveCtx.clearRect(0, 0, naveCanvas.width, naveCanvas.height);
  hideNaveScoreScreen();
}

function endNaveGame() {
  naveRunning = false;
  cancelAnimationFrame(naveLoopId);
  showNaveScoreScreen();
}

function showNaveScoreScreen() {
  document.getElementById("naveFinalScore").textContent = naveScore;
  document.getElementById("naveScoreScreen").style.display = "block";
}

function hideNaveScoreScreen() {
  document.getElementById("naveScoreScreen").style.display = "none";
}

document.getElementById("navePlayBtn").addEventListener("click", startNaveGame);
document.getElementById("navePauseBtn").addEventListener("click", pauseNaveGame);
document.getElementById("naveRestartBtn").addEventListener("click", () => {
  resetNaveGame();
  startNaveGame();
});

// Movimiento y disparo
document.addEventListener("keydown", (e) => {
  if (!naveRunning || navePaused) return;

  switch (e.code) {
    case "ArrowUp":
      if (nave.y > 0) nave.y -= 15;
      break;
    case "ArrowDown":
      if (nave.y + nave.height < naveCanvas.height) nave.y += 15;
      break;
    case "Space":
      projectiles.push({
        x: nave.x + nave.width,
        y: nave.y + nave.height / 2 - 2,
        width: 10,
        height: 4,
        speed: 6
      });
      break;
  }
});

