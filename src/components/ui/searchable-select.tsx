'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  searchText?: string;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  fallbackLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

export default function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Chọn...',
  searchPlaceholder = 'Tìm kiếm...',
  emptyText = 'Không tìm thấy kết quả',
  fallbackLabel,
  disabled = false,
  loading = false,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const displayLabel = selectedOption?.label ?? (value ? fallbackLabel : undefined);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return options;
    return options.filter((opt) =>
      normalizeText(`${opt.label} ${opt.searchText ?? ''}`).includes(normalizedQuery)
    );
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery('');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      if (prev) {
        setQuery('');
      }
      return !prev;
    });
  };

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-outline-variant/60 bg-surface px-3 text-left text-sm transition-colors hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        <span
          className={`truncate ${
            displayLabel ? 'text-on-surface font-medium' : 'text-on-surface-variant/75'
          }`}
        >
          {displayLabel || placeholder}
        </span>

        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        ) : (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-on-surface-variant transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest shadow-lg"
          >
            <div className="border-b border-outline-variant/25 p-2">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-on-surface-variant/70" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-8.5 w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/50 pl-8 pr-7 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 rounded p-0.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto p-1.5">
              {loading && options.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6 text-xs text-on-surface-variant">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>{placeholder}</span>
                </div>
              ) : filteredOptions.length === 0 ? (
                <p className="py-5 text-center text-xs text-on-surface-variant">
                  {emptyText}
                </p>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

