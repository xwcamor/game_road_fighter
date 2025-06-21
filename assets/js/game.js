const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameArea = document.getElementById('gameArea'); // Referencia al contenedor del canvas
const gameMessage = document.getElementById('gameMessage'); // Referencia al mensaje inicial

// Configuración del juego
let GAME_SPEED = 5; // Velocidad base del juego
let CAR_SPEED = 5; // Velocidad de movimiento del coche del jugador
let OBSTACLE_SPEED_MULTIPLIER = 1.2; // Los obstáculos se mueven un poco más rápido que el fondo
const OBSTACLE_SPAWN_INTERVAL = 1500; // Intervalo de tiempo para que aparezcan nuevos obstáculos (ms)
const OBSTACLE_WIDTH = 70; // Aumentado para que el camión sea más grande
const OBSTACLE_HEIGHT = 140; // Aumentado para que el camión sea más grande

// Variables del juego
let score = 0;
let level = 1;
let gameOver = false;
let obstacles = [];
let lastObstacleSpawnTime = 0;
let gameStarted = false; // Nueva variable para controlar si el juego ha iniciado

// Elementos del juego
let car = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 120,
    width: 50,
    height: 100,
    speed: CAR_SPEED,
    image: new Image()
};

let road = new Image();
road.src = 'assets/images/PISTAFONDO.png'; // Asegúrate que esta ruta sea correcta
car.image.src = 'assets/images/ferrari.png'; // Asegúrate que esta ruta sea correcta

// Cargar imagen del único tipo de obstáculo
const obstacleImage = new Image();
obstacleImage.src = 'assets/images/camion.png'; // RUTA DE TU ÚNICA IMAGEN DE OBSTÁCULO

// Fondo de carretera que se mueve
let roadY = 0;

// Entradas del usuario
let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Función para generar obstáculos
function spawnObstacle() {
    const obstacleX = Math.random() * (canvas.width - OBSTACLE_WIDTH);
    const obstacleY = -OBSTACLE_HEIGHT;
    obstacles.push({
        x: obstacleX,
        y: obstacleY,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        image: obstacleImage,
        speed: GAME_SPEED * OBSTACLE_SPEED_MULTIPLIER
    });
}

// Detección de colisiones (AABB - Axis-Aligned Bounding Box)
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Actualizar estado del juego
function update(deltaTime) {
    if (gameOver) return;

    // Mover coche del jugador
    if (keys['ArrowLeft'] && car.x > 0) {
        car.x -= car.speed;
    }
    if (keys['ArrowRight'] && car.x < canvas.width - car.width) {
        car.x += car.speed;
    }

    // Mover el fondo para efecto de desplazamiento
    roadY += GAME_SPEED;
    if (roadY >= canvas.height) {
        roadY = 0;
    }

    // Generar obstáculos
    const currentTime = Date.now();
    if (currentTime - lastObstacleSpawnTime > OBSTACLE_SPAWN_INTERVAL / level) {
        spawnObstacle();
        lastObstacleSpawnTime = currentTime;
    }

    // Mover obstáculos y detectar colisiones
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        // Detección de colisiones con el coche del jugador
        if (checkCollision(car, obstacle)) {
            gameOver = true;
            alert(`¡Juego Terminado!\nPuntuación: ${score}\nNivel: ${level}`);
            // Reiniciar el juego automáticamente después de la alerta
            document.location.reload();
            return; // Detener la ejecución para evitar más actualizaciones
        }

        // Eliminar obstáculos fuera de pantalla y aumentar puntuación
        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            i--; // Ajustar índice ya que se eliminó un elemento
            score += 10;
            // Incrementar nivel cada 100 puntos
            if (score % 100 === 0 && score > 0) {
                level++;
                // Aumentar un poco la velocidad del juego con cada nivel
                // Asegúrate de que GAME_SPEED no se vuelva demasiado alto
                if (GAME_SPEED < 20) { // Establece un límite superior para la velocidad
                    GAME_SPEED += 0.5;
                }
            }
        }
    }
}

// Dibujar elementos en el canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el fondo de carretera con efecto de movimiento
    ctx.drawImage(road, 0, roadY, canvas.width, canvas.height);
    ctx.drawImage(road, 0, roadY - canvas.height, canvas.width, canvas.height);

    // Dibujar el coche del jugador
    ctx.drawImage(car.image, car.x, car.y, car.width, car.height);

    // Dibujar obstáculos
    for (const obstacle of obstacles) {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Mostrar puntuación y nivel
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial'; // Un poco más grande para mejor visibilidad
    ctx.fillText(`Puntuación: ${score}`, 20, 30);
    ctx.fillText(`Nivel: ${level}`, 20, 60);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial'; // Más grande para el mensaje de Game Over
        ctx.textAlign = 'center';
        ctx.fillText('¡Juego Terminado!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('Reiniciando...', canvas.width / 2, canvas.height / 2 + 30); // Mensaje de reinicio
    }
}

// Bucle principal del juego
let lastFrameTime = 0;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    if (!gameOver && gameStarted) { // Solo actualiza si el juego ha iniciado y no ha terminado
        update(deltaTime);
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Asegurarse de que todas las imágenes estén cargadas antes de habilitar el botón de inicio
let imagesLoaded = 0;
const totalImages = 3; // car.image, road, y obstacleImage

function imageLoadHandler() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startButton.disabled = false; // Habilitar el botón una vez que las imágenes carguen
        startButton.textContent = 'Iniciar Juego'; // Cambiar el texto del botón
        gameMessage.textContent = '¡Todo listo! Pulsa Iniciar Juego.'; // Mensaje listo

        // Iniciar el gameLoop una vez para dibujar el fondo antes de que el juego comience realmente
        // Esto evita un lienzo en blanco mientras se espera el inicio del juego.
        requestAnimationFrame(gameLoop);
    }
}

road.onload = imageLoadHandler;
car.image.onload = imageLoadHandler;
obstacleImage.onload = imageLoadHandler;

// Event listener para el botón de inicio
startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none'; // Ocultar el botón
    gameMessage.style.display = 'none'; // Ocultar el mensaje
    gameArea.style.display = 'flex'; // Mostrar el área del juego (canvas)
    canvas.focus(); // Opcional: enfocar el canvas para que reciba las teclas de inmediato
});

// El setTimeout de respaldo es útil, pero con el `defer` en el script y la lógica de `onload`,
// ya es muy probable que funcione bien. Lo dejo comentado.
/*
setTimeout(() => {
    if (imagesLoaded === totalImages && !gameStarted) {
        startButton.disabled = false;
        startButton.textContent = 'Iniciar Juego';
        gameMessage.textContent = '¡Todo listo! Pulsa Iniciar Juego.';
    }
}, 500);
*/