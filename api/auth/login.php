<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$input = getJsonInput();
$errors = [];
$errors[] = Validator::required($input['email'] ?? '', 'Email');
$errors[] = Validator::required($input['password'] ?? '', 'Password');
$errors = array_filter($errors);

if (!empty($errors)) {
    jsonResponse(false, null, implode(', ', $errors), 422);
}

$userModel = new User();
$user = $userModel->login($input['email'], $input['password']);

if (!$user) {
    jsonResponse(false, null, 'Invalid email or password', 401);
}

Auth::login($user);
jsonResponse(true, $user, 'Login successful');
