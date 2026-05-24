<?php

require_once __DIR__ . "/../../config/database.php";

try {
    $stmt = $pdo->query("
        SELECT 
            id,
            module_key,
            name,
            description,
            order_index,
            minimum_score_to_unlock,
            is_active
        FROM modules
        WHERE is_active = 1
        ORDER BY order_index ASC
    ");

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "No se pudieron obtener los módulos"
    ]);
}