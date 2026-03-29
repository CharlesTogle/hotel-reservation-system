<?php

require_once __DIR__ . '/../classes/Database.php';

$db = Database::getInstance();

// Create tables
$db->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        contact_number TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )
");

$db->exec("
    CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        capacity TEXT NOT NULL,
        room_type TEXT NOT NULL,
        rate_per_day REAL NOT NULL,
        description TEXT,
        image_url TEXT,
        UNIQUE(capacity, room_type)
    )
");

$db->exec("
    CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        room_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        contact_number TEXT NOT NULL,
        check_in TEXT NOT NULL,
        check_out TEXT NOT NULL,
        num_days INTEGER NOT NULL,
        payment_type TEXT NOT NULL,
        rate_per_day REAL NOT NULL,
        subtotal REAL NOT NULL,
        discount_amount REAL NOT NULL DEFAULT 0,
        surcharge_amount REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'confirmed',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (room_id) REFERENCES rooms(id)
    )
");

// Seed rooms
$rooms = [
    ['Single', 'Regular',  100.00, 'Cozy single room with essential amenities for solo travelers.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
    ['Single', 'De Luxe',  300.00, 'Upgraded single room with premium furnishings and ocean views.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'],
    ['Single', 'Suite',    500.00, 'Luxurious single suite with private balcony and lounge area.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'],
    ['Double', 'Regular',  200.00, 'Comfortable double room perfect for couples or friends.', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80'],
    ['Double', 'De Luxe',  500.00, 'Spacious double deluxe with designer interiors and minibar.', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80'],
    ['Double', 'Suite',    800.00, 'Premium double suite with separate living area and spa bath.', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'],
    ['Family', 'Regular',  500.00, 'Roomy family accommodation with extra beds and kid-friendly setup.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'],
    ['Family', 'De Luxe',  750.00, 'Deluxe family room with connecting spaces and entertainment.', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'],
    ['Family', 'Suite',   1000.00, 'Grand family suite with multiple bedrooms and panoramic views.', 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80'],
];

$stmt = $db->prepare("INSERT OR IGNORE INTO rooms (capacity, room_type, rate_per_day, description, image_url) VALUES (?, ?, ?, ?, ?)");
foreach ($rooms as $room) {
    $stmt->execute($room);
}

// Seed admin user
$adminExists = $db->query("SELECT COUNT(*) FROM users WHERE email = 'admin@hotelmemis.com'")->fetchColumn();
if (!$adminExists) {
    $stmt = $db->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['Admin', 'admin@hotelmemis.com', password_hash('admin123', PASSWORD_DEFAULT), 'admin']);
}

echo "Migration completed successfully!\n";
echo "Admin account: admin@hotelmemis.com / admin123\n";
