<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$roomModel = new Room();
$rooms = $roomModel->getAll();
jsonResponse(true, $rooms);
