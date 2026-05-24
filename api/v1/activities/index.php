<?php

require_once __DIR__ . "/../../config/database.php";

$module_id = $_GET["module_id"] ?? null;

try {
    if ($module_id) {
        $stmt = $pdo->prepare("
            SELECT 
                id,
                module_id,
                lesson_id,
                activity_type,
                instruction,
                question,
                content_json,
                correct_answer,
                audio_text,
                hint,
                example_text,
                image_url,
                difficulty,
                source,
                is_active
            FROM activities
            WHERE is_active = 1
              AND module_id = ?
            ORDER BY created_at ASC
        ");
        $stmt->execute([$module_id]);
    } else {
        $stmt = $pdo->query("
            SELECT 
                id,
                module_id,
                lesson_id,
                activity_type,
                instruction,
                question,
                content_json,
                correct_answer,
                audio_text,
                hint,
                example_text,
                image_url,
                difficulty,
                source,
                is_active
            FROM activities
            WHERE is_active = 1
            ORDER BY created_at ASC
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
        "error" => "No se pudieron obtener las actividades"
    ]);
}