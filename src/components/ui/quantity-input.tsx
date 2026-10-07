'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { showCustomToast } from '@/components/toast/CustomToast';

export interface QuantityInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    maxStock?: number;
    disabled?: boolean;
    className?: string;
    toastMessage?: string;
}

export default function QuantityInput({
    value,
    onChange,
    min = 1,
    maxStock,
    disabled = false,
    className = '',
    toastMessage,
}: QuantityInputProps) {
    const handleDecrease = () => {
        if (disabled || value <= min) return;
        onChange(value - 1);
    };

    const handleIncrease = () => {
        if (disabled) return;

        if (maxStock !== undefined && maxStock > 0 && value >= maxStock) {
            showCustomToast({
                message: toastMessage || `Số lượng vượt quá tồn kho`,
                type: 'error',
            });
            return;
        }

        onChange(value + 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const valStr = e.target.value.replace(/\D/g, '');
        if (valStr === '') {
            onChange(min);
            return;
        }

        const numVal = parseInt(valStr, 10);
        if (isNaN(numVal)) return;

        if (maxStock !== undefined && maxStock > 0 && numVal > maxStock) {
            showCustomToast({
                message: toastMessage || `Số lượng vượt quá tồn kho`,
                type: 'error',
            });
            onChange(maxStock);
            return;
        }

        if (numVal < min) {
            onChange(min);
            return;
        }

        onChange(numVal);
    };

    return (
        <div className={`inline-flex items-center rounded-lg bg-surface-container-lowest border border-outline-variant/40 p-1 shadow-2xs ${className}`}>
            <button
                type="button"
                onClick={handleDecrease}
                disabled={disabled || value <= min}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container-low active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Decrease quantity"
            >
                <Minus className="h-4 w-4 stroke-2" />
            </button>
            <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-12 text-center text-sm font-bold text-on-surface bg-transparent focus:outline-none focus:ring-0 border-none p-0"
            />
            <button
                type="button"
                onClick={handleIncrease}
                disabled={disabled || value === maxStock}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container-low active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Increase quantity"
            >
                <Plus className="h-4 w-4 stroke-2" />
            </button>
        </div>
    );
}
