<?php

require_once __DIR__ . "/../../config/database.php";

$method = $_SERVER["REQUEST_METHOD"];

function readJsonBody() {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function tableExists($pdo, $tableName) {
    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = ?
    ");
    $stmt->execute([$tableName]);
    return ((int)$stmt->fetchColumn()) > 0;
}

function deleteProfileRelatedRows($pdo, $tableName, $profileId) {
    if (!tableExists($pdo, $tableName)) {
        return;
    }

    $stmt = $pdo->prepare("DELETE FROM `$tableName` WHERE user_profile_id = ?");
    $stmt->execute([$profileId]);
}

try {

    if ($method === "GET") {

        $stmt = $pdo->query("
            SELECT
                id,
                name,
                age,
                photo_url,
                onboarding_complete,
                current_module_id,
                current_lesson_id,
                current_level,
                total_stars,
                last_session_at,
                created_at,
                updated_at
            FROM user_profiles
            ORDER BY created_at DESC
        ");

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll()
        ]);
        exit;
    }

    if ($method === "POST") {

        $data = readJsonBody();

        $id = $data["id"] ?? uniqid("profile_", true);

        $stmt = $pdo->prepare("
            INSERT INTO user_profiles (
                id,
                name,
                age,
                photo_url,
                onboarding_complete,
                current_level,
                total_stars
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $id,
            $data["name"] ?? "",
            $data["age"] ?? null,
            $data["photo_url"] ?? null,
            $data["onboarding_complete"] ?? 0,
            $data["current_level"] ?? 1,
            $data["total_stars"] ?? 0
        ]);

        $settingsId = uniqid("settings_", true);

        $stmtSettings = $pdo->prepare("
            INSERT INTO user_settings (
                id,
                user_profile_id,
                font_size,
                high_contrast,
                volume,
                voice_enabled,
                music_enabled,
                navigation_voice,
                reduced_motion
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmtSettings->execute([
            $settingsId,
            $id,
            $data["font_size"] ?? "large",
            $data["high_contrast"] ?? 0,
            $data["volume"] ?? 80,
            $data["voice_enabled"] ?? 1,
            $data["music_enabled"] ?? 0,
            $data["navigation_voice"] ?? 1,
            $data["reduced_motion"] ?? 0
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Perfil creado",
            "data" => [
                "id" => $id
            ]
        ]);
        exit;
    }

    if ($method === "DELETE") {

        $data = readJsonBody();
        $id = $_GET["id"] ?? $data["id"] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error" => "No se recibió el ID del perfil a eliminar"
            ]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id, name FROM user_profiles WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $profile = $stmt->fetch();

        if (!$profile) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "error" => "Perfil no encontrado"
            ]);
            exit;
        }

        $pdo->beginTransaction();

        // Primero se eliminan tablas hijas para no dejar basura en la BD.
        // Esto cubre avance, intentos, recompensas, certificados, ejercicios generados y ajustes.
        deleteProfileRelatedRows($pdo, "certificates", $id);
        deleteProfileRelatedRows($pdo, "generated_exercises", $id);
        deleteProfileRelatedRows($pdo, "user_rewards", $id);
        deleteProfileRelatedRows($pdo, "module_progress", $id);
        deleteProfileRelatedRows($pdo, "activity_attempts", $id);
        deleteProfileRelatedRows($pdo, "user_settings", $id);

        $deleteProfile = $pdo->prepare("DELETE FROM user_profiles WHERE id = ?");
        $deleteProfile->execute([$id]);

        $pdo->commit();

        echo json_encode([
            "success" => true,
            "message" => "Perfil y datos relacionados eliminados",
            "data" => [
                "id" => $id,
                "name" => $profile["name"]
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

    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);

}
