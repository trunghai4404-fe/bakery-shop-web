'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ProductInterface } from '@/interface/catalog';
import { CatalogApi } from '@/actions/catalog';
import ProductSlider from './ProductSlider';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

interface ProductSectionProps {
    title: string;
    description?: string;
    viewMoreLink?: string;
    categoryId?: number;
    categorySlug?: string;
    initialProducts?: ProductInterface[];
}

const ProductSection = ({
    title,
    description,
    viewMoreLink,
    categoryId,
    categorySlug,
    initialProducts,
}: ProductSectionProps) => {
    const [products, setProducts] = useState<ProductInterface[]>(initialProducts || []);
    const [loading, setLoading] = useState<boolean>(!initialProducts);
    const [isVisible, setIsVisible] = useState<boolean>(!!initialProducts);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isVisible || initialProducts) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px 0px',
                threshold: 0.01,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible, initialProducts]);

    useEffect(() => {
        if (isVisible && !initialProducts && (categoryId || categorySlug)) {
            let isMounted = true;
            setLoading(true);

            CatalogApi.getProducts({
                CategoryId: categoryId,
                CategorySlug: categorySlug,
                IsActive: true,
                PageSize: 6,
            })
                .then((res) => {
                    if (isMounted) {
                        const items = res?.data?.items ?? [];
                        setProducts(items);
                    }
                })
                .catch((err) => {
                    console.error(`Failed to fetch products for category ${title}:`, err);
                })
                .finally(() => {
                    if (isMounted) setLoading(false);
                });

            return () => {
                isMounted = false;
            };
        }
    }, [isVisible, categoryId, categorySlug, initialProducts, title]);

    const effectiveViewMoreLink =
        viewMoreLink || (categorySlug ? `/product-list?category=${categorySlug}` : '/product-list');

    if (!loading && isVisible && (!products || products.length === 0)) {
        return null;
    }

    return (
        <section ref={sectionRef} className="w-full py-8 md:py-12 min-h-70">
            <div className="">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-4 border-b border-outline-variant/30 pb-4">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between md:justify-start gap-2">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
                                {title}
                            </h2>
                            {effectiveViewMoreLink && (
                                <Link
                                    href={effectiveViewMoreLink}
                                    className="group inline-flex md:hidden items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 shrink-0"
                                >
                                    <span>Xem tất cả</span>
                                    <ArrowRight className="h-4 w-4 stroke-2 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                        {description && (
                            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {effectiveViewMoreLink && (
                        <Link
                            href={effectiveViewMoreLink}
                            className="hidden group md:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 self-start sm:self-auto shrink-0"
                        >
                            <span>Xem tất cả</span>
                            <ArrowRight className="h-4 w-4 stroke-2 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>

                <ProductSlider products={products} loading={loading || !isVisible} />
            </div>
        </section>
    );
};

export default ProductSection;