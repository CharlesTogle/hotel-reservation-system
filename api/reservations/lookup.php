<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$token = $_GET['token'] ?? '';
if (empty(trim($token))) {
    jsonResponse(false, null, 'Reservation code is required', 422);
}

$reservationModel = new Reservation();
$reservation = $reservationModel->getByToken(strtoupper(trim($token)));

if (!$reservation) {
    jsonResponse(false, null, 'Reservation not found. Please check your code and try again.', 404);
}

jsonResponse(true, $reservation);
