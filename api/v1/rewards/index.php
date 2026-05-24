<?php

require_once __DIR__ . "/../../config/database.php";

$method = $_SERVER["REQUEST_METHOD"];

function readJsonBody() {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function makeId($prefix = "reward_") {
    return uniqid($prefix, true);
}

function ensureRewardCatalog(PDO $pdo) {
    // Si existen insignias creadas sin module_id, las vinculamos al módulo real por module_key.
    $pdo->exec("
        UPDATE reward_catalog rc
        INNER JOIN modules m
            ON rc.reward_key = CONCAT('badge_', m.module_key)
        SET rc.module_id = m.id
        WHERE rc.module_id IS NULL
    ");

    // Crear una insignia base por cada módulo activo que aún no tenga reward_catalog.
    $modulesStmt = $pdo->query("
        SELECT id, module_key, name
        FROM modules
        WHERE is_active = TRUE
        ORDER BY order_index ASC
    ");

    $modules = $modulesStmt->fetchAll();

    $existsStmt = $pdo->prepare("
        SELECT id
        FROM reward_catalog
        WHERE reward_key = ?
        LIMIT 1
    ");

    $insertStmt = $pdo->prepare("
        INSERT INTO reward_catalog (
            id,
            reward_key,
            name,
            description,
            reward_type,
            module_id,
            required_percentage,
            is_active
        ) VALUES (?, ?, ?, ?, 'badge', ?, 70, TRUE)
    ");

    foreach ($modules as $module) {
        $rewardKey = "badge_" . $module["module_key"];

        $existsStmt->execute([$rewardKey]);
        $exists = $existsStmt->fetch();

        if (!$exists) {
            $insertStmt->execute([
                makeId("rc_"),
                $rewardKey,
                "Insignia de " . $module["name"],
                "Reconocimiento por completar el módulo: " . $module["name"],
                $module["id"]
            ]);
        }
    }
}

function unlockRewards(PDO $pdo, $userProfileId = null) {
    ensureRewardCatalog($pdo);

    $sql = "
        SELECT
            mp.user_profile_id,
            mp.module_id,
            rc.id AS reward_id
        FROM module_progress mp
        INNER JOIN reward_catalog rc
            ON rc.module_id = mp.module_id
        WHERE rc.is_active = TRUE
          AND mp.completed = TRUE
          AND mp.percentage >= rc.required_percentage
    ";

    $params = [];

    if ($userProfileId) {
        $sql .= " AND mp.user_profile_id = ?";
        $params[] = $userProfileId;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $insert = $pdo->prepare("
        INSERT IGNORE INTO user_rewards (
            id,
            user_profile_id,
            reward_id,
            module_id
        ) VALUES (?, ?, ?, ?)
    ");

    $created = 0;

    foreach ($rows as $row) {
        $insert->execute([
            makeId("ur_"),
            $row["user_profile_id"],
            $row["reward_id"],
            $row["module_id"]
        ]);

        if ($insert->rowCount() > 0) {
            $created++;
        }
    }

    return $created;
}

function fetchRewards(PDO $pdo, $userProfileId = null) {
    $sql = "
        SELECT
            ur.id,
            ur.user_profile_id,
            ur.reward_id,
            ur.module_id,
            ur.unlocked_at,
            rc.reward_key,
            rc.name,
            rc.name AS title,
            rc.description,
            rc.reward_type,
            rc.image_url,
            rc.required_percentage,
            m.module_key,
            m.name AS module_name
        FROM user_rewards ur
        INNER JOIN reward_catalog rc
            ON rc.id = ur.reward_id
        LEFT JOIN modules m
            ON m.id = ur.module_id
        WHERE 1 = 1
    ";

    $params = [];

    if ($userProfileId) {
        $sql .= " AND ur.user_profile_id = ?";
        $params[] = $userProfileId;
    }

    $sql .= " ORDER BY ur.unlocked_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rewards = $stmt->fetchAll();

    foreach ($rewards as &$reward) {
        $reward["icon"] = "🏅";
        $reward["earned_at"] = $reward["unlocked_at"];
    }

    return $rewards;
}

try {

    if ($method === "GET") {
        $userProfileId = $_GET["user_profile_id"] ?? null;

        $created = unlockRewards($pdo, $userProfileId);
        $rewards = fetchRewards($pdo, $userProfileId);

        echo json_encode([
            "success" => true,
            "created" => $created,
            "data" => $rewards
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === "POST") {
        $data = readJsonBody();
        $userProfileId = $data["user_profile_id"] ?? null;

        $created = unlockRewards($pdo, $userProfileId);
        $rewards = fetchRewards($pdo, $userProfileId);

        echo json_encode([
            "success" => true,
            "message" => "Recompensas sincronizadas",
            "created" => $created,
            "data" => $rewards
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Método no permitido"
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
