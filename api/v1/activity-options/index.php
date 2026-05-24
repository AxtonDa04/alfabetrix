<?php

require_once __DIR__ . "/../../config/database.php";

$activity_id = $_GET["activity_id"] ?? null;

try {
    if ($activity_id) {
        $stmt = $pdo->prepare("
            SELECT
                id,
                activity_id,
                option_text,
                option_image_url,
                audio_text,
                is_correct,
                order_index
            FROM activity_options
            WHERE activity_id = ?
            ORDER BY order_index ASC
        ");
        $stmt->execute([$activity_id]);
    } else {
        $stmt = $pdo->query("
            SELECT
                id,
                activity_id,
                option_text,
                option_image_url,
                audio_text,
                is_correct,
                order_index
            FROM activity_options
            ORDER BY activity_id ASC, order_index ASC
        ");
    }

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll()
    ]);
} catch (Exception $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "No se pudieron obtener las opciones de actividad"
    ]);
}
