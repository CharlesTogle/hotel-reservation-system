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

    public function isRoomAvailable(int $roomId, string $checkIn, string $checkOut): bool
    {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) FROM reservations
            WHERE room_id = ? AND status != 'cancelled'
            AND check_in < ? AND check_out > ?
        ");
        $stmt->execute([$roomId, $checkOut, $checkIn]);
        return $stmt->fetchColumn() == 0;
    }

    public function create(array $data): array
    {
        if (!$this->isRoomAvailable((int)$data['room_id'], $data['check_in'], $data['check_out'])) {
            return ['success' => false, 'message' => 'Room is not available for the selected dates'];
        }

        $maxAttempts = 3;
        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            $token = self::generateToken();

            try {
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
            } catch (PDOException $e) {
                // Retry on UNIQUE constraint violation
                if ($attempt === $maxAttempts || strpos($e->getMessage(), 'UNIQUE') === false) {
                    throw $e;
                }
            }
        }

        throw new RuntimeException('Failed to generate a unique reservation token');
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
        $validStatuses = ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'];
        if (!in_array($status, $validStatuses)) {
            return false;
        }

        $stmt = $this->db->prepare("UPDATE reservations SET status = ?, updated_at = datetime('now') WHERE id = ?");
        return $stmt->execute([$status, $id]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM reservations WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function getPaginated(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("
            SELECT r.*, rm.capacity, rm.room_type
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            ORDER BY r.created_at DESC
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getCount(): int
    {
        return (int)$this->db->query("SELECT COUNT(*) FROM reservations")->fetchColumn();
    }
}
