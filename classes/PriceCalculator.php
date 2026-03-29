<?php

class PriceCalculator
{
    public static function calculate(float $ratePerDay, int $numDays, string $paymentType): array
    {
        if ($ratePerDay <= 0 || $numDays <= 0) {
            return ['success' => false, 'message' => 'Invalid rate or number of days'];
        }

        $validPaymentTypes = ['cash', 'check', 'cheque', 'credit card'];
        if (!in_array(strtolower($paymentType), $validPaymentTypes)) {
            return ['success' => false, 'message' => 'Unrecognized payment type'];
        }

        $subtotal = $ratePerDay * $numDays;
        $discountPercent = 0;
        $surchargePercent = 0;

        // Cash discounts
        if (strtolower($paymentType) === 'cash') {
            if ($numDays >= 6) {
                $discountPercent = 15;
            } elseif ($numDays >= 3) {
                $discountPercent = 10;
            }
        }

        $discountAmount = $subtotal * ($discountPercent / 100);
        $afterDiscount = $subtotal - $discountAmount;

        // Payment surcharges
        $paymentLower = strtolower($paymentType);
        if ($paymentLower === 'check' || $paymentLower === 'cheque') {
            $surchargePercent = 5;
        } elseif ($paymentLower === 'credit card') {
            $surchargePercent = 10;
        }

        $surchargeAmount = $afterDiscount * ($surchargePercent / 100);
        $total = $afterDiscount + $surchargeAmount;

        return [
            'rate_per_day' => $ratePerDay,
            'num_days' => $numDays,
            'subtotal' => round($subtotal, 2),
            'discount_percent' => $discountPercent,
            'discount_amount' => round($discountAmount, 2),
            'surcharge_percent' => $surchargePercent,
            'surcharge_amount' => round($surchargeAmount, 2),
            'total' => round($total, 2),
        ];
    }
}
