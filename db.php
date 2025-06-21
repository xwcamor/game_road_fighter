<?php
$db_host = "localhost";
$db_user = "root"; // Cambia si es necesario
$db_pass = "00"; // Cambia si es necesario
$db_name = "road_fighter";

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_errno) {
    die("Error al conectar MySQL: (" . $conn->connect_errno . ") " . $conn->connect_error);
}
?>