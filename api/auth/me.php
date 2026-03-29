<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

$user = Auth::user();
if (!$user) {
    jsonResponse(false, null, 'Not authenticated', 401);
}

jsonResponse(true, $user);
