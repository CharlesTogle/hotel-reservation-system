<?php

class Room
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll(): array
    {
        return $this->db->query("SELECT * FROM rooms ORDER BY capacity, room_type")->fetchAll();
    }

    public function getByCapacityAndType(string $capacity, string $roomType): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM rooms WHERE capacity = ? AND room_type = ?");
        $stmt->execute([$capacity, $roomType]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM rooms WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $values = [];

        $allowed = ['rate_per_day', 'description', 'image_url'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (array_key_exists('rate_per_day', $data)) {
            if (!is_numeric($data['rate_per_day']) || $data['rate_per_day'] <= 0) {
                return false;
            }
        }

        if (empty($fields)) return false;

        $values[] = $id;
        $sql = "UPDATE rooms SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($values);
    }
}
