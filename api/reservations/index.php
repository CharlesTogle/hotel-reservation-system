<?php

require_once __DIR__ . '/../bootstrap.php';
Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$reservationModel = new Reservation();
$reservations = $reservationModel->getAll();
jsonResponse(true, $reservations);
