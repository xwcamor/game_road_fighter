<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Juego - Road Fighter</title>
    <link rel="stylesheet" href="styles/style.css">
    <script src="assets/js/game.js" defer></script>
</head>
<body>
    <div id="gamePageContainer"> <h1>Bienvenido a Road Fighter, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
        <div id="gameContainer"> <p id="gameMessage">Prepara tus reflejos. ¡Evita los camiones!</p>
            <button id="startButton">Cargando Juego...</button> <div id="gameArea" style="display: none;"> <canvas id="gameCanvas" width="800" height="600"></canvas>
            </div>
        </div>
        <a href="logout.php">Cerrar sesión</a>
    </div>
</body>
</html>