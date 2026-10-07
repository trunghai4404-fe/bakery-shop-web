import React from 'react';

interface ProductCardSkeletonProps {
    className?: string;
}

export function ProductCardSkeleton({ className = '' }: ProductCardSkeletonProps) {
    return (
        <div
            className={`w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden flex flex-col animate-pulse ${className}`}
        >
            <div className="aspect-4/3 w-full bg-surface-container-low" />
            <div className="p-4 flex flex-col flex-1">
                <div className="h-4 bg-surface-container-high rounded-md w-3/4 mb-2" />
                <div className="space-y-1.5 mb-4">
                    <div className="h-3 bg-surface-container-low rounded-md w-full" />
                    <div className="h-3 bg-surface-container-low rounded-md w-2/3" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/25 mt-auto">
                    <div className="space-y-1">
                        <div className="h-2.5 bg-surface-container-low rounded-md w-10" />
                        <div className="h-5 bg-primary/20 rounded-md w-16" />
                    </div>
                    <div className="h-8 bg-primary/15 rounded-xl w-24" />
                </div>
            </div>
        </div>
    );
}

interface ProductSkeletonGridProps {
    count?: number;
    className?: string;
    responsiveHide?: boolean;
}

export default function ProductSkeletonGrid({
    count = 4,
    className = '',
    responsiveHide = true,
}: ProductSkeletonGridProps) {
    return (
        <div className={`grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-2 px-1 w-full ${className}`}>
            {Array.from({ length: count }).map((_, idx) => (
                <ProductCardSkeleton
                    key={idx}
                    className={
                        responsiveHide
                            ? `
                                ${idx >= 1 ? 'hidden min-[480px]:flex' : ''} 
                                ${idx >= 2 ? 'hidden md:flex' : ''} 
                                ${idx >= 3 ? 'hidden lg:flex' : ''}
                            `
                            : ''
                    }
                />
            ))}
        </div>
    );
}
