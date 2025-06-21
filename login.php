<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

   var_dump($_POST);
    echo "Usuario recibido: $username, Contraseña recibida: $password<br>";

    include 'db.php';

    // 4) Construyo la consulta usando las variables que acabo de definir
    $sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    echo "Consulta SQL construida: $sql<br>";


    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $_SESSION['username'] = $username;
        header("Location: game.php");
    } else {
    echo "Usuario o contraseña incorrectos. Consulta: $sql";
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login - Road Fighter</title>
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <h2>Login</h2>
    <form method="post" action="">
        <label for="username">Usuario:</label>
        <input type="text" name="username" required>
        <br>
        <label for="password">Contraseña:</label>
        <input type="password" name="password" required>
        <br>
        <input type="submit" value="Entrar">
    </form>
</body>
</html>