'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';

export interface SortOption {
    label: string;
    value: string;
}

interface SortDropdownProps {
    value: string;
    options: SortOption[];
    onChange: (value: string) => void;
    className?: string;
}

export default function SortDropdown({ value, options, onChange, className = '' }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={`relative text-left z-40 w-full sm:w-auto inline-block ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full inline-flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs sm:text-sm font-semibold text-on-surface hover:border-primary/40 focus:outline-hidden focus:ring-2 focus:ring-primary/30 transition-all duration-200 shadow-2xs cursor-pointer whitespace-nowrap"
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <ArrowUpDown className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{selectedOption?.label}</span>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-on-surface-variant transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1.5 min-w-full w-max max-w-70 rounded-lg bg-surface-container-lowest border border-outline-variant/30 shadow-xl p-1 z-999 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                    <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-on-surface-variant/70 uppercase border-b border-outline-variant/20 mb-1">
                        Sắp xếp theo
                    </div>
                    <div className="space-y-0.5">
                        {options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${isSelected
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'text-on-surface hover:bg-surface-container-high hover:text-primary'
                                        }`}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
