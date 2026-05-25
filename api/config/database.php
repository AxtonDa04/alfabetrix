<?php

require_once __DIR__ . "/cors.php";


$host = "fdb1032.awardspace.net";
$db_name = "4762204_alfabetrix";
$username = "4762204_alfabetrix";
$password = "MypassR323323332";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db_name;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos"
    ]);
    exit;
}
