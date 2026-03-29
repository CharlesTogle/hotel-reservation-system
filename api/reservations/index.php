<?php

require_once __DIR__ . '/../bootstrap.php';
Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$reservationModel = new Reservation();

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = max(1, min(100, (int)($_GET['limit'] ?? 50)));

$reservations = $reservationModel->getPaginated($page, $limit);
$total = $reservationModel->getCount();

http_response_code(200);
echo json_encode([
    'success' => true,
    'data' => $reservations,
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
    ],
]);
exit;
