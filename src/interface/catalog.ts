import { ListResponse } from "./pagination";

// Product interface
export interface ProductImageInterface {
    id: number;
    productId: number;
    desktopUrl: string;
    mobileUrl: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface ProductVariantInterface {
    id: number;
    productId: number;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    sortOrder: number;
}

export interface ProductCategoryInterface {
    categoryId: number;
    name: string;
    slug: string;
}

export interface ProductInterface {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    images: ProductImageInterface[];
    variants: ProductVariantInterface[];
    categories: ProductCategoryInterface[];
}
export type ProductResponse = ListResponse<ProductInterface>


// Category interface

export interface CategoryInterface {
    id: number;
    name: string;
    slug: string;
    description: string;
    parentId: number | null;
    parentName: string | null;
    imageUrl: string;
    sortOrder: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    childrenCount: number;
}

export type CategoriesResponse = ListResponse<CategoryInterface>

export interface CategoriesTree {
    id: number,
    name: string,
    slug: string,
    description: string,
    parentId: number | null,
    imageUrl: string,
    sortOrder: number,
    isFeatured: boolean,
    isActive: boolean,
    children: CategoriesTree[],
}

// Parameters interface

export interface CategoriesParams {
    Search?: string;
    IsActive?: boolean;
    ParentId?: number;
    IsRoot?: boolean;
    IsFeatured?: boolean;
    SortBy?: string;
    IsDescending?: boolean;
    Page?: number;
    PageSize?: number;
}
export interface ProductsParams {
    Search?: string;
    CategoryId?: number;
    CategorySlug?: string;
    IsActive?: boolean;
    SortBy?: string;
    IsDescending?: boolean;
    Page?: number;
    PageSize?: number;
}