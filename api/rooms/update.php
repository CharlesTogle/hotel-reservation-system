<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

Auth::requireAdmin();

$input = getJsonInput();

if (empty($input['id'])) {
    jsonResponse(false, null, 'Room ID is required', 400);
}

$roomModel = new Room();
$room = $roomModel->findById((int) $input['id']);

if (!$room) {
    jsonResponse(false, null, 'Room not found', 404);
}

$data = [];

if (isset($input['rate_per_day'])) {
    $rate = floatval($input['rate_per_day']);
    if ($rate <= 0) {
        jsonResponse(false, null, 'Rate must be greater than zero', 400);
    }
    $data['rate_per_day'] = $rate;
}

if (isset($input['description'])) {
    $desc = trim($input['description']);
    if (strlen($desc) === 0) {
        jsonResponse(false, null, 'Description cannot be empty', 400);
    }
    $data['description'] = $desc;
}

if (isset($input['image_url'])) {
    $url = trim($input['image_url']);
    if (strlen($url) === 0) {
        jsonResponse(false, null, 'Image URL cannot be empty', 400);
    }
    $data['image_url'] = $url;
}

if (empty($data)) {
    jsonResponse(false, null, 'No fields to update', 400);
}

$success = $roomModel->update((int) $input['id'], $data);

if ($success) {
    $updated = $roomModel->findById((int) $input['id']);
    jsonResponse(true, $updated, 'Room updated successfully');
} else {
    jsonResponse(false, null, 'Failed to update room', 500);
}
