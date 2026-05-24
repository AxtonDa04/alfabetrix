<?php

require_once __DIR__ . "/../../config/database.php";

$method = $_SERVER["REQUEST_METHOD"];

function readJsonBody() {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

try {

    if ($method === "GET") {

        $user_profile_id = $_GET["user_profile_id"] ?? null;
        $module_id = $_GET["module_id"] ?? null;

        $sql = "
            SELECT
                id,
                user_profile_id,
                module_id,
                completed_activities,
                correct_answers,
                incorrect_answers,
                total_responses,
                current_round,
                stars,
                percentage,
                completed,
                error_summary,
                completed_at,
                last_activity_at,
                created_at,
                updated_at
            FROM module_progress
            WHERE 1 = 1
        ";

        $params = [];

        if ($user_profile_id) {
            $sql .= " AND user_profile_id = ?";
            $params[] = $user_profile_id;
        }

        if ($module_id) {
            $sql .= " AND module_id = ?";
            $params[] = $module_id;
        }

        $sql .= " ORDER BY updated_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll()
        ]);
        exit;
    }

    if ($method === "POST") {

        $data = readJsonBody();

        $user_profile_id = $data["user_profile_id"] ?? null;
        $module_id = $data["module_id"] ?? null;

        if (!$user_profile_id || !$module_id) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error" => "Faltan user_profile_id o module_id"
            ]);
            exit;
        }

        $correct_answers = (int)($data["correct_answers"] ?? 0);
        $incorrect_answers = (int)($data["incorrect_answers"] ?? 0);
        $total_responses = (int)($data["total_responses"] ?? ($correct_answers + $incorrect_answers));
        $stars = (int)($data["stars"] ?? 0);
        $percentage = (int)($data["percentage"] ?? 0);
        $completed = !empty($data["completed"]) ? 1 : 0;
        $completed_activities = (int)($data["completed_activities"] ?? 0);
        $error_summary = isset($data["error_summary"])
            ? json_encode($data["error_summary"], JSON_UNESCAPED_UNICODE)
            : null;

        $stmt = $pdo->prepare("
            SELECT *
            FROM module_progress
            WHERE user_profile_id = ?
              AND module_id = ?
            LIMIT 1
        ");
        $stmt->execute([$user_profile_id, $module_id]);
        $existing = $stmt->fetch();

        if ($existing) {

            $new_correct = ((int)$existing["correct_answers"]) + $correct_answers;
            $new_incorrect = ((int)$existing["incorrect_answers"]) + $incorrect_answers;
            $new_total = ((int)$existing["total_responses"]) + $total_responses;
            $new_round = ((int)$existing["current_round"]) + 1;
            $new_stars = max((int)$existing["stars"], $stars);
            $new_percentage = max((int)$existing["percentage"], $percentage);
            $new_completed = ((int)$existing["completed"] === 1 || $completed === 1) ? 1 : 0;
            $new_completed_activities = ((int)$existing["completed_activities"]) + $completed_activities;
            $completed_at = $new_completed ? ($existing["completed_at"] ?: date("Y-m-d H:i:s")) : null;

            $update = $pdo->prepare("
                UPDATE module_progress
                SET
                    completed_activities = ?,
                    correct_answers = ?,
                    incorrect_answers = ?,
                    total_responses = ?,
                    current_round = ?,
                    stars = ?,
                    percentage = ?,
                    completed = ?,
                    error_summary = COALESCE(?, error_summary),
                    completed_at = ?,
                    last_activity_at = NOW()
                WHERE id = ?
            ");

            $update->execute([
                $new_completed_activities,
                $new_correct,
                $new_incorrect,
                $new_total,
                $new_round,
                $new_stars,
                $new_percentage,
                $new_completed,
                $error_summary,
                $completed_at,
                $existing["id"]
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Progreso actualizado",
                "data" => [
                    "id" => $existing["id"],
                    "user_profile_id" => $user_profile_id,
                    "module_id" => $module_id,
                    "percentage" => $new_percentage,
                    "stars" => $new_stars,
                    "completed" => $new_completed
                ]
            ]);
            exit;
        }

        $id = $data["id"] ?? uniqid("progress_", true);
        $completed_at = $completed ? date("Y-m-d H:i:s") : null;

        $insert = $pdo->prepare("
            INSERT INTO module_progress (
                id,
                user_profile_id,
                module_id,
                completed_activities,
                correct_answers,
                incorrect_answers,
                total_responses,
                current_round,
                stars,
                percentage,
                completed,
                error_summary,
                completed_at,
                last_activity_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        $insert->execute([
            $id,
            $user_profile_id,
            $module_id,
            $completed_activities,
            $correct_answers,
            $incorrect_answers,
            $total_responses,
            1,
            $stars,
            $percentage,
            $completed,
            $error_summary,
            $completed_at
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Progreso creado",
            "data" => [
                "id" => $id,
                "user_profile_id" => $user_profile_id,
                "module_id" => $module_id,
                "percentage" => $percentage,
                "stars" => $stars,
                "completed" => $completed
            ]
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Método no permitido"
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);

}
