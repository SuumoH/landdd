window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("spaceshipCanvas");
    const ctx = canvas.getContext("2d");
  
    // Define el tamaño del canvas
    canvas.width = window.innerWidth * 0.8; // 80% del ancho de la ventana
    canvas.height = 400; // Altura fija
  
    // Objeto de la nave del jugador
    let spaceship = {
      x: canvas.width / 2 - 20,
      y: canvas.height - 60,
      width: 40,
      height: 40,
      speed: 5
    };
  
    // Arreglos para balas y enemigos
    let bullets = [];
    let enemies = [];
  
    // Temporizador para la aparición de enemigos
    let enemySpawnTimer = 0;
    let enemySpawnInterval = 100; // Cada 100 frames se genera un enemigo
  
    let gameRunning = true;
  
    // Función principal de actualización (game loop)
    function update() {
      if (!gameRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      drawSpaceship();
      updateBullets();
      updateEnemies();
      checkCollisions();
  
      enemySpawnTimer++;
      if (enemySpawnTimer > enemySpawnInterval) {
        spawnEnemy();
        enemySpawnTimer = 0;
      }
  
      requestAnimationFrame(update);
    }
  
    // Dibuja la nave del jugador
    function drawSpaceship() {
      ctx.fillStyle = "#9cf";
      ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    }
  
    // Actualiza y dibuja las balas
    function updateBullets() {
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
        }
      }
      drawBullets();
    }
  
    function drawBullets() {
      ctx.fillStyle = "#fff";
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
    }
  
    // Actualiza y dibuja los enemigos
    function updateEnemies() {
      for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;
        if (enemies[i].y > canvas.height) {
          enemies.splice(i, 1);
        }
      }
      drawEnemies();
    }
  
    function drawEnemies() {
      ctx.fillStyle = "#f55";
      enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
    }
  
    // Función para generar un enemigo aleatorio
    function spawnEnemy() {
      const enemyWidth = 40;
      const enemyHeight = 40;
      const enemyX = Math.random() * (canvas.width - enemyWidth);
      const enemyY = -enemyHeight;
      const enemySpeed = 2 + Math.random() * 2;
      enemies.push({ x: enemyX, y: enemyY, width: enemyWidth, height: enemyHeight, speed: enemySpeed });
    }
  
    // Verifica colisiones entre enemigos, balas y la nave
    function checkCollisions() {
      // Colisiones entre la nave y los enemigos (fin del juego)
      for (let i = enemies.length - 1; i >= 0; i--) {
        if (rectsCollide(spaceship, enemies[i])) {
          gameOver();
          return;
        }
        // Colisiones entre balas y enemigos
        for (let j = bullets.length - 1; j >= 0; j--) {
          if (rectsCollide(bullets[j], enemies[i])) {
            enemies.splice(i, 1);
            bullets.splice(j, 1);
            break;
          }
        }
      }
    }
  
    // Función auxiliar para detectar colisiones
    function rectsCollide(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    }
  
    // Fin del juego
    function gameOver() {
      gameRunning = false;
      alert("Juego terminado");
    }
  
    // Controla el disparo: crea una bala que sale de la nave
    function shootBullet() {
      const bullet = {
        x: spaceship.x + spaceship.width / 2 - 2.5,
        y: spaceship.y,
        width: 5,
        height: 10,
        speed: 7
      };
      bullets.push(bullet);
    }
  
    // Manejo de controles
    document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft") {
        spaceship.x -= spaceship.speed;
        if (spaceship.x < 0) spaceship.x = 0;
      } else if (e.code === "ArrowRight") {
        spaceship.x += spaceship.speed;
        if (spaceship.x + spaceship.width > canvas.width)
          spaceship.x = canvas.width - spaceship.width;
      } else if (e.code === "Space") {
        shootBullet();
      }
    });
  
    // Inicia el juego
    update();
  });
  