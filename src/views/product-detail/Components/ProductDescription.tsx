'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductDescriptionProps {
    description?: string;
}

const COLLAPSED_HEIGHT = 100;

export default function ProductDescription({ description }: ProductDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [shouldShowToggle, setShouldShowToggle] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            if (contentRef.current.scrollHeight > COLLAPSED_HEIGHT + 20) {
                setShouldShowToggle(true);
            } else {
                setShouldShowToggle(false);
            }
        }
    }, [description]);

    if (!description || !description.trim()) {
        return (
            <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant/70 text-sm italic">
                Chưa có thông tin mô tả chi tiết cho sản phẩm này.
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-outline-variant/25">
                <h2 className="font-heading text-base sm:text-lg font-bold text-on-surface tracking-tight">
                    Mô tả sản phẩm
                </h2>
            </div>

            <div className="relative overflow-hidden">
                <motion.div
                    initial={false}
                    animate={{
                        height: !shouldShowToggle || isExpanded ? 'auto' : `${COLLAPSED_HEIGHT}px`
                    }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="overflow-hidden"
                >
                    <div
                        ref={contentRef}
                        className="prose prose-sm max-w-none text-on-surface leading-relaxed text-xs sm:text-sm space-y-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_img]:rounded-xl [&_img]:my-3 [&_img]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </motion.div>

                {shouldShowToggle && !isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-14 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent pointer-events-none" />
                )}
            </div>

            {shouldShowToggle && (
                <div className="pt-1 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-all cursor-pointer"
                    >
                        <span>{isExpanded ? 'Thu gọn' : 'Xem thêm chi tiết'}</span>
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4 stroke-2" />
                        ) : (
                            <ChevronDown className="h-4 w-4 stroke-2" />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
