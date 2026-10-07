'use client';

import React, { useEffect, useState, useTransition, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/layouts/breadcrumb';
import { useBreadcrumbStore } from '@/zustand/breadcrumb/store';
import { CatalogApi } from '@/actions/catalog';
import { ProductInterface, CategoriesTree, ProductResponse } from '@/interface/catalog';
import { useDebounce } from '@/hook/useDebounce';
import CategorySidebar from './Components/CategorySidebar';
import ProductListGrid from './Components/ProductListGrid';
import SortDropdown, { SortOption } from './Components/SortDropdown';
import AppPagination from '@/components/ui/app-pagination';
import { Search, LayoutGrid, Filter, X } from 'lucide-react';

const PAGE_SIZE = 12;

const SORT_OPTIONS: SortOption[] = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Giá tăng dần', value: 'price-asc' },
    { label: 'Giá giảm dần', value: 'price-desc' },
];

interface ProductListProps {
    initialCategoryTree?: CategoriesTree[];
}

export default function ProductList({ initialCategoryTree = [] }: ProductListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setCrumb = useBreadcrumbStore((state) => state.setCrumb);

    const categorySlugParam = searchParams.get('category') || '';
    const searchParam = searchParams.get('search') || '';
    const sortParam = searchParams.get('sort') || 'newest';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const [categoryTree, setCategoryTree] = useState<CategoriesTree[]>(initialCategoryTree);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoriesTree | null>(null);
    const [totalProducts, setTotalProducts] = useState<number>(0);

    const [treeLoading, setTreeLoading] = useState<boolean>(initialCategoryTree.length === 0);
    const [productsLoading, setProductsLoading] = useState<boolean>(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>(searchParam);
    const debouncedSearch = useDebounce(searchInput, 500);

    const [isPending, startTransition] = useTransition();

    const updateQueryParams = useCallback(
        (newParams: { category?: string; search?: string; sort?: string; page?: number }) => {
            const params = new URLSearchParams(searchParams.toString());

            if (newParams.category !== undefined) {
                if (newParams.category) params.set('category', newParams.category);
                else params.delete('category');
                params.delete('page');
            }

            if (newParams.search !== undefined) {
                if (newParams.search) params.set('search', newParams.search);
                else params.delete('search');
                params.delete('page');
            }

            if (newParams.sort !== undefined) {
                if (newParams.sort) params.set('sort', newParams.sort);
                else params.delete('sort');
                params.delete('page');
            }

            if (newParams.page !== undefined) {
                if (newParams.page > 1) params.set('page', newParams.page.toString());
                else params.delete('page');
            }

            startTransition(() => {
                router.push(`/product-list?${params.toString()}`);
            });
        },
        [router, searchParams]
    );

    const findCategoryInTree = (nodes: CategoriesTree[], slug: string): CategoriesTree | null => {
        for (const node of nodes) {
            if (node.slug === slug) return node;
            if (node.children && node.children.length > 0) {
                const found = findCategoryInTree(node.children, slug);
                if (found) return found;
            }
        }
        return null;
    };

    useEffect(() => {
        const crumbName = selectedCategory ? selectedCategory.name : 'Danh sách sản phẩm';
        setCrumb({
            name: crumbName,
            pathname: '/product-list',
        });
    }, [selectedCategory, setCrumb]);

    useEffect(() => {
        let isMounted = true;

        if (categoryTree.length === 0) {
            setTreeLoading(true);
            CatalogApi.getCategoriesTree({ IsActive: true })
                .then((res) => {
                    if (!isMounted) return;
                    const rawItems = res?.data ?? res?.items;
                    const treeData = Array.isArray(rawItems) ? rawItems : [];
                    setCategoryTree(treeData);

                    if (categorySlugParam) {
                        const match = findCategoryInTree(treeData, categorySlugParam);
                        setSelectedCategory(match);
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch category tree:', err);
                })
                .finally(() => {
                    if (isMounted) setTreeLoading(false);
                });
        } else if (categorySlugParam) {
            const match = findCategoryInTree(categoryTree, categorySlugParam);
            setSelectedCategory(match);
            setTreeLoading(false);
        } else {
            setSelectedCategory(null);
            setTreeLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (categoryTree.length > 0) {
            if (categorySlugParam) {
                const match = findCategoryInTree(categoryTree, categorySlugParam);
                setSelectedCategory(match);
            } else {
                setSelectedCategory(null);
            }
        }
    }, [categorySlugParam, categoryTree]);

    useEffect(() => {
        if (debouncedSearch !== searchParam) {
            updateQueryParams({ search: debouncedSearch.trim() });
        }
    }, [debouncedSearch, searchParam, updateQueryParams]);

    useEffect(() => {
        setSearchInput(searchParam);
    }, [searchParam]);

    useEffect(() => {
        let isMounted = true;
        setProductsLoading(true);

        let sortBy = 'createdAt';
        let isDescending = true;

        if (sortParam === 'oldest') {
            sortBy = 'createdAt';
            isDescending = false;
        } else if (sortParam === 'price-asc') {
            sortBy = 'price';
            isDescending = false;
        } else if (sortParam === 'price-desc') {
            sortBy = 'price';
            isDescending = true;
        }

        CatalogApi.getProducts({
            CategorySlug: categorySlugParam || undefined,
            Search: searchParam || undefined,
            SortBy: sortBy,
            IsDescending: isDescending,
            IsActive: true,
            Page: currentPage,
            PageSize: PAGE_SIZE,
        })
            .then((res) => {
                if (!isMounted) return;
                const itemsList = res?.data?.items ?? [];
                setProducts(itemsList);
                setTotalProducts(res?.data?.totalCount ?? itemsList.length);
            })
            .catch((err) => {
                console.error('Failed to fetch products:', err);
                if (isMounted) {
                    setProducts([]);
                    setTotalProducts(0);
                }
            })
            .finally(() => {
                if (isMounted) setProductsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [categorySlugParam, searchParam, sortParam, currentPage]);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateQueryParams({ search: searchInput.trim() });
    }

    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    const headerTitle = selectedCategory ? selectedCategory.name : 'Tất cả sản phẩm';
    const headerDescription =
        selectedCategory?.description ||
        'Khám phá bộ sưu tập bánh ngọt tươi ngon được làm mới mỗi ngày từ nguyên liệu cao cấp chọn lọc.';

    return (
        <div className="py-4 sm:py-6 flex flex-col gap-6 w-full">
            <Breadcrumb />

            <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
                <CategorySidebar
                    categoryTree={categoryTree}
                    selectedCategorySlug={categorySlugParam}
                    onSelectCategory={(category) => {
                        updateQueryParams({ category: category?.slug || '' });
                    }}
                    loading={treeLoading}
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileOpenChange={setIsMobileSidebarOpen}
                />

                <div className="flex-1 w-full space-y-4">
                    <div className="relative z-30 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-4 shadow-2xs space-y-3">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-3">
                                <h1 className="font-heading text-lg sm:text-3xl font-extrabold tracking-tight text-on-surface">
                                    {headerTitle}
                                </h1>

                                {productsLoading || isPending ? (
                                    <div className="h-7 w-28 bg-white rounded-full animate-pulse shrink-0" />
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container/60 text-on-primary-container text-xs font-semibold shrink-0">
                                        <LayoutGrid className="h-3.5 w-3.5 text-primary" />
                                        <span>{totalProducts} sản phẩm</span>
                                    </span>
                                )}
                            </div>

                            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                                {headerDescription}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-outline-variant/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:max-w-md">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Tìm kiếm tên bánh, vị bánh..."
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:ring-2 focus:ring-primary/30 transition-all"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/60" />
                            </form>

                            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileSidebarOpen(true)}
                                    className={`lg:hidden flex-1 inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer shrink-0 min-w-35 ${selectedCategory
                                        ? 'bg-primary/10 border-primary/40 text-primary font-bold'
                                        : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface font-semibold hover:bg-surface-container-low'
                                        }`}
                                >
                                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                                        <Filter className="h-4 w-4 text-primary shrink-0" />
                                        <span className="truncate">{selectedCategory ? selectedCategory.name : 'Danh mục'}</span>
                                    </div>
                                    {selectedCategory ? (
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQueryParams({ category: '' });
                                            }}
                                            className="p-0.5 hover:bg-primary/20 rounded-full text-primary transition-colors cursor-pointer shrink-0"
                                            title="Xóa lọc danh mục"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </span>
                                    ) : null}
                                </button>

                                <div className="flex-1 sm:flex-none">
                                    <SortDropdown
                                        value={sortParam}
                                        options={SORT_OPTIONS}
                                        onChange={(newSort) => updateQueryParams({ sort: newSort })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <ProductListGrid products={products} loading={productsLoading || isPending} />

                    <AppPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            updateQueryParams({ page });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={productsLoading || isPending}
                    />
                </div>
            </div>
        </div>
    );
}
