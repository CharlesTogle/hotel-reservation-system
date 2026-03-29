<?php

class Validator
{
    public static function required($value, string $field): ?string
    {
        if (trim((string)$value) === '') {
            return "$field is required";
        }
        return null;
    }

    public static function email(string $value): ?string
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return "Invalid email address";
        }
        return null;
    }

    public static function minLength(string $value, int $min, string $field): ?string
    {
        if (strlen($value) < $min) {
            return "$field must be at least $min characters";
        }
        return null;
    }

    public static function maxLength(string $value, int $max, string $field): ?string
    {
        if (strlen($value) > $max) {
            return "$field must be at most $max characters";
        }
        return null;
    }

    public static function phoneNumber(string $value): ?string
    {
        $cleaned = preg_replace('/[\s\-\(\)]/', '', $value);
        if (!preg_match('/^(\+63|0)\d{10}$/', $cleaned)) {
            return "Invalid phone number format";
        }
        return null;
    }

    public static function dateRange(string $from, string $to): ?string
    {
        $fromDate = DateTime::createFromFormat('Y-m-d', $from);
        $toDate = DateTime::createFromFormat('Y-m-d', $to);
        $today = new DateTime(date('Y-m-d'));

        if (!$fromDate || $fromDate->format('Y-m-d') !== $from) {
            return "Invalid date format";
        }
        if (!$toDate || $toDate->format('Y-m-d') !== $to) {
            return "Invalid date format";
        }
        if ($fromDate < $today) {
            return "Check-in date cannot be in the past";
        }
        if ($toDate <= $fromDate) {
            return "Check-out must be after check-in";
        }
        return null;
    }

    public static function inArray($value, array $allowed, string $field): ?string
    {
        if (!in_array($value, $allowed)) {
            return "Invalid $field selection";
        }
        return null;
    }
}
