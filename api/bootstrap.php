<?php

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Autoload classes
spl_autoload_register(function ($class) {
    $file = __DIR__ . '/../classes/' . $class . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

Auth::start();

function jsonResponse(bool $success, $data = null, string $message = '', int $code = 200): void
{
    http_response_code($code);
    $response = ['success' => $success];
    if ($data !== null) $response['data'] = $data;
    if ($message) $response['message'] = $message;
    echo json_encode($response);
    exit;
}

function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(false, null, 'Invalid JSON input', 400);
    }
    return $input ?: [];
}
