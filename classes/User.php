<?php

class User
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function register(string $name, string $email, string $password, string $contactNumber = ''): array
    {
        if ($this->findByEmail($email)) {
            return ['success' => false, 'message' => 'Email already registered'];
        }

        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, contact_number) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT), $contactNumber]);
        return $this->findById($this->db->lastInsertId());
    }

    public function login(string $email, string $password): ?array
    {
        $user = $this->findByEmailWithPassword($email);
        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            return $user;
        }
        return null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT id, name, email, role, contact_number, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT id, name, email, role, contact_number, created_at FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public function findByEmailWithPassword(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT id, name, email, password, role, contact_number, created_at FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }
}
