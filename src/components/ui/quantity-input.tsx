'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { showCustomToast } from '@/components/toast/CustomToast';

export type QuantityInputSize = 'sm' | 'md' | 'lg';

export interface QuantityInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    maxStock?: number;
    disabled?: boolean;
    className?: string;
    toastMessage?: string;
    size?: QuantityInputSize;
}

export default function QuantityInput({
    value,
    onChange,
    min = 1,
    maxStock,
    disabled = false,
    className = '',
    toastMessage,
    size = 'md',
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

    const sizeClasses = {
        sm: {
            container: 'p-0.5',
            button: 'h-7 w-7 rounded-md',
            icon: 'h-3 w-3',
            input: 'w-8 text-xs font-bold',
        },
        md: {
            container: 'p-1',
            button: 'h-9 w-9 rounded-lg',
            icon: 'h-4 w-4',
            input: 'w-12 text-sm font-bold',
        },
        lg: {
            container: 'p-1',
            button: 'h-10 w-10 rounded-lg',
            icon: 'h-5 w-5',
            input: 'w-14 text-base font-bold',
        },
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div className={`inline-flex items-center rounded-lg bg-surface-container-lowest border border-outline-variant/40 shadow-2xs ${currentSize.container} ${className}`}>
            <button
                type="button"
                onClick={handleDecrease}
                disabled={disabled || value <= min}
                className={`${currentSize.button} flex items-center justify-center text-on-surface hover:bg-surface-container-low active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer`}
                aria-label="Decrease quantity"
            >
                <Minus className={`${currentSize.icon} stroke-2`} />
            </button>
            <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleInputChange}
                disabled={disabled}
                className={`${currentSize.input} text-center text-on-surface bg-transparent focus:outline-none focus:ring-0 border-none p-0`}
            />
            <button
                type="button"
                onClick={handleIncrease}
                disabled={disabled || value === maxStock}
                className={`${currentSize.button} flex items-center justify-center text-on-surface hover:bg-surface-container-low active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer`}
                aria-label="Increase quantity"
            >
                <Plus className={`${currentSize.icon} stroke-2`} />
            </button>
        </div>
    );
}

