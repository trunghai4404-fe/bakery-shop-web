import callApi, { ApiResponse } from "@/apis/handleApi";
import { ApiRouters } from "@/constants/api-routes";
import { CategoriesParams, CategoriesResponse, CategoriesTree, ProductInterface, ProductResponse, ProductsParams } from "@/interface/catalog";

export const CatalogApi = {
    getCategories: async (params: CategoriesParams): Promise<ApiResponse<CategoriesResponse>> => {
        const query = new URLSearchParams()
        if (params.Search) query.append("Search", params.Search.toString())
        if (params.IsActive) query.append("IsActive", params.IsActive.toString())
        if (params.ParentId) query.append("ParentId", params.ParentId.toString())
        if (params.IsRoot) query.append("IsRoot", params.IsRoot.toString())
        if (params.IsFeatured) query.append("IsFeatured", params.IsFeatured.toString())
        if (params.SortBy) query.append("SortBy", params.SortBy.toString())
        if (params.IsDescending !== undefined) query.append("IsDescending", params.IsDescending.toString())
        if (params.Page) query.append("Page", params.Page.toString())
        if (params.PageSize) query.append("PageSize", params.PageSize.toString())

        const url = `${ApiRouters.CATEGORIES}?${query.toString()}`

        return callApi<CategoriesResponse>(url)
    },
    getCategoriesTree: async (params: { IsActive: boolean }): Promise<ApiResponse<CategoriesTree[]>> => {
        const query = new URLSearchParams()
        query.append("IsActive", params.IsActive.toString())
        const url = `${ApiRouters.CATEGORIES}/tree?${query.toString()}`
        return callApi<CategoriesTree[]>(url)
    },
    getProducts: async (params: ProductsParams): Promise<ApiResponse<ProductResponse>> => {
        const query = new URLSearchParams()
        if (params.Search) query.append("search", params.Search.toString())
        if (params.CategoryId) query.append("categoryId", params.CategoryId.toString())
        if (params.CategorySlug) query.append("categorySlug", params.CategorySlug.toString())
        if (params.IsActive !== undefined) query.append("isActive", params.IsActive.toString())
        if (params.SortBy) query.append("sortBy", params.SortBy.toString())
        if (params.IsDescending !== undefined) query.append("isDescending", params.IsDescending.toString())
        if (params.Page) query.append("page", params.Page.toString())
        if (params.PageSize) query.append("pageSize", params.PageSize.toString())

        const url = `${ApiRouters.PRODUCTS}?${query.toString()}`

        return await callApi<ProductResponse>(url)
    },
    getProductBySlug: async (slug: string): Promise<ApiResponse<ProductInterface>> => {
        const url = `${ApiRouters.PRODUCTS}/${slug}`
        return await callApi<ProductInterface>(url)
    }
}