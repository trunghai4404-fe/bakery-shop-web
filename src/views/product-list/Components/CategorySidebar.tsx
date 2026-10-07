'use client';

import React, { useState } from 'react';
import { CategoriesTree } from '@/interface/catalog';
import { Layers, ChevronDown, Cake, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategorySidebarProps {
    categoryTree: CategoriesTree[];
    selectedCategorySlug?: string;
    onSelectCategory: (category?: CategoriesTree) => void;
    loading?: boolean;
    isMobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
}

interface TreeItemProps {
    item: CategoriesTree;
    selectedSlug?: string;
    onSelect: (category?: CategoriesTree) => void;
    depth?: number;
}

function TreeItem({ item, selectedSlug, onSelect, depth = 0 }: TreeItemProps) {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedSlug === item.slug;
    const [isOpen, setIsOpen] = useState<boolean>(isSelected || item.children?.some(c => c.slug === selectedSlug));

    return (
        <div className="space-y-1">
            <div
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${isSelected
                    ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-2xs'
                    : 'text-on-surface hover:bg-surface-container-high hover:text-primary'
                    }`}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
                onClick={() => onSelect(item)}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{item.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {hasChildren && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                            className={`p-1 rounded-lg hover:bg-black/10 transition-colors ${isSelected ? 'text-primary' : 'text-on-surface-variant'
                                }`}
                        >
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="h-3.5 w-3.5" />
                            </motion.div>
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence initial={false}>
                {hasChildren && isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden space-y-1 border-l border-outline-variant/30 ml-4 pl-1"
                    >
                        {item.children.map((child) => (
                            <TreeItem
                                key={child.id}
                                item={child}
                                selectedSlug={selectedSlug}
                                onSelect={onSelect}
                                depth={depth + 1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function CategorySidebar({
    categoryTree = [],
    selectedCategorySlug,
    onSelectCategory,
    loading = false,
    isMobileOpen: controlledMobileOpen,
    onMobileOpenChange,
}: CategorySidebarProps) {
    const [internalMobileOpen, setInternalMobileOpen] = useState<boolean>(false);

    const isMobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;
    const setIsMobileOpen = (open: boolean) => {
        if (onMobileOpenChange) {
            onMobileOpenChange(open);
        } else {
            setInternalMobileOpen(open);
        }
    };

    const isAllSelected = !selectedCategorySlug;

    const sidebarContent = (
        <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3 className="font-heading text-sm font-bold text-on-surface tracking-tight uppercase">
                        Danh Mục Sản Phẩm
                    </h3>
                </div>
                {isMobileOpen && (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-1.5 rounded-xl hover:bg-surface-container-high text-on-surface-variant"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-2 animate-pulse py-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-9 bg-surface-container-high rounded-xl w-full" />
                    ))}
                </div>
            ) : (
                <div className="space-y-1.5">
                    <button
                        type="button"
                        onClick={() => {
                            onSelectCategory(undefined);
                            setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${isAllSelected
                            ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-2xs'
                            : 'text-on-surface hover:bg-surface-container-high hover:text-primary'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Cake className="h-4 w-4" />
                            <span>Tất cả sản phẩm</span>
                        </div>
                        {isAllSelected && <Check className="h-3.5 w-3.5 stroke-3" />}
                    </button>

                    {categoryTree.map((item) => (
                        <TreeItem
                            key={item.id}
                            item={item}
                            selectedSlug={selectedCategorySlug}
                            onSelect={(cat) => {
                                onSelectCategory(cat);
                                setIsMobileOpen(false);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-5 shadow-xs h-fit sticky top-24">
                {sidebarContent}
            </aside>

            <AnimatePresence>
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="relative ml-auto w-full max-w-xs bg-surface-container-lowest h-full p-5 shadow-2xl overflow-y-auto flex flex-col z-10"
                        >
                            {sidebarContent}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
