<?php

require_once __DIR__ . '/../bootstrap.php';
Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$input = getJsonInput();
$errors = [];
$errors[] = Validator::required($input['id'] ?? '', 'Reservation ID');
$errors[] = Validator::required($input['status'] ?? '', 'Status');
$errors[] = Validator::inArray($input['status'] ?? '', ['confirmed', 'checked_in', 'checked_out', 'cancelled'], 'Status');
$errors = array_filter($errors);

if (!empty($errors)) {
    jsonResponse(false, null, implode(', ', $errors), 422);
}

$reservationModel = new Reservation();
$reservation = $reservationModel->getById((int)$input['id']);
if (!$reservation) {
    jsonResponse(false, null, 'Reservation not found', 404);
}

$reservationModel->update((int)$input['id'], $input['status']);
$updated = $reservationModel->getById((int)$input['id']);

jsonResponse(true, $updated, 'Reservation updated successfully');
