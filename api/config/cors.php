<?php

$allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
	"http://localhost",
    "http://127.0.0.1",
    "http://192.168.100.12:5173",
    "https://alfabetrix.vercel.app"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
$originHost = $origin ? parse_url($origin, PHP_URL_HOST) : "";

if (
    in_array($origin, $allowedOrigins, true) ||
    ($originHost && preg_match('/\.vercel\.app$/', $originHost))
) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Vary: Origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}