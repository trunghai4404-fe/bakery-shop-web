'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface AppPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    className?: string;
}

export default function AppPagination({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
    className = '',
}: AppPaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const delta = 1;
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const pages = getPageNumbers();

    return (
        <nav
            aria-label="Pagination"
            className={`flex items-center justify-between gap-1.5 sm:gap-2 pt-4 border-t border-outline-variant/25 ${className}`}
        >
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage <= 1}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-on-surface hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-xs sm:text-sm font-semibold"
                aria-label="Trang trước"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Trang trước</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-1.5">
                {pages.map((page, idx) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="h-9 sm:h-10 w-8 sm:w-9 flex items-center justify-center text-on-surface-variant/60 text-xs sm:text-sm font-medium select-none"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            type="button"
                            onClick={() => onPageChange(pageNum)}
                            disabled={disabled || isActive}
                            className={`h-9 sm:h-10 min-w-9 sm:min-w-10 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/40'
                                : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface hover:bg-surface-container-low hover:border-outline-variant/70'
                                }`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage >= totalPages}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-on-surface hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-xs sm:text-sm font-semibold"
                aria-label="Trang sau"
            >
                <span className="hidden sm:inline">Trang sau</span>
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}
