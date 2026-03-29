<?php

require_once __DIR__ . '/../bootstrap.php';
Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$id = $_GET['id'] ?? null;

if (!$id) {
    jsonResponse(false, null, 'Reservation ID is required', 422);
}

$reservationModel = new Reservation();
$reservation = $reservationModel->getById((int)$id);
if (!$reservation) {
    jsonResponse(false, null, 'Reservation not found', 404);
}

$reservationModel->delete((int)$id);
jsonResponse(true, null, 'Reservation deleted successfully');
