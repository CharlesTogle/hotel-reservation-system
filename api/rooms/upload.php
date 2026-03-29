<?php

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, 'Method not allowed', 405);
}

Auth::requireAdmin();

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload limit',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form upload limit',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
    ];
    $code = $_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE;
    $msg = $errorMessages[$code] ?? 'Upload failed';
    jsonResponse(false, null, $msg, 400);
}

$file = $_FILES['image'];

// Validate file size (10MB max)
$maxSize = 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    jsonResponse(false, null, 'File too large. Maximum size is 10MB.', 400);
}

// Validate MIME type
$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    'image/svg+xml' => 'svg',
    'image/bmp'  => 'bmp',
    'image/tiff' => 'tiff',
];

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!isset($allowedTypes[$mimeType])) {
    jsonResponse(false, null, 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG, BMP, TIFF.', 400);
}

$ext = $allowedTypes[$mimeType];

// Generate unique filename
$filename = uniqid('room_', true) . '.' . $ext;
$uploadDir = __DIR__ . '/../../rooms/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$destination = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonResponse(false, null, 'Failed to save uploaded file', 500);
}

$imageUrl = 'rooms/' . $filename;

jsonResponse(true, ['image_url' => $imageUrl], 'Image uploaded successfully');
