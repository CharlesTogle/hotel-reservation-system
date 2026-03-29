<?php

class Reservation
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public static function generateToken(): string
    {
        return strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
    }

    public function create(array $data): array
    {
        $token = self::generateToken();
        // Ensure uniqueness
        while ($this->getByToken($token)) {
            $token = self::generateToken();
        }

        $stmt = $this->db->prepare("
            INSERT INTO reservations (token, room_id, customer_name, contact_number, check_in, check_out, num_days, payment_type, rate_per_day, subtotal, discount_amount, surcharge_amount, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $token, $data['room_id'], $data['customer_name'], $data['contact_number'],
            $data['check_in'], $data['check_out'], $data['num_days'], $data['payment_type'],
            $data['rate_per_day'], $data['subtotal'], $data['discount_amount'],
            $data['surcharge_amount'], $data['total']
        ]);
        return $this->getById($this->db->lastInsertId());
    }

    public function getAll(): array
    {
        return $this->db->query("
            SELECT r.*, rm.capacity, rm.room_type
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            ORDER BY r.created_at DESC
        ")->fetchAll();
    }

    public function getByToken(string $token): ?array
    {
        $stmt = $this->db->prepare("
            SELECT r.*, rm.capacity, rm.room_type
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            WHERE r.token = ?
        ");
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT r.*, rm.capacity, rm.room_type
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            WHERE r.id = ?
        ");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function update(int $id, string $status): bool
    {
        $stmt = $this->db->prepare("UPDATE reservations SET status = ?, updated_at = datetime('now') WHERE id = ?");
        return $stmt->execute([$status, $id]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM reservations WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
