<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$input = getJsonInput();
$errors = [];
$errors[] = Validator::required($input['room_id'] ?? '', 'Room');
$errors[] = Validator::required($input['check_in'] ?? '', 'Check-in date');
$errors[] = Validator::required($input['check_out'] ?? '', 'Check-out date');
$errors[] = Validator::required($input['payment_type'] ?? '', 'Payment type');
$errors[] = Validator::inArray($input['payment_type'] ?? '', ['Cash', 'Check', 'Credit Card'], 'Payment type');
$errors = array_filter($errors);

if (!empty($errors)) {
    jsonResponse(false, null, implode(', ', $errors), 422);
}

$dateError = Validator::dateRange($input['check_in'], $input['check_out']);
if ($dateError) {
    jsonResponse(false, null, $dateError, 422);
}

$roomModel = new Room();
$room = $roomModel->findById((int)$input['room_id']);
if (!$room) {
    jsonResponse(false, null, 'Room not found', 404);
}

$checkIn = new DateTime($input['check_in']);
$checkOut = new DateTime($input['check_out']);
$numDays = (int)$checkIn->diff($checkOut)->days;

$pricing = PriceCalculator::calculate($room['rate_per_day'], $numDays, $input['payment_type']);

if (isset($pricing['success']) && !$pricing['success']) {
    jsonResponse(false, null, $pricing['message'], 422);
}

$pricing['room'] = $room;

jsonResponse(true, $pricing);
