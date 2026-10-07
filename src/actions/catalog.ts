import callApi from "@/apis/handleApi";
import { ApiRouters } from "@/constants/api-routes";
import { CategoriesParams, ProductsParams } from "@/interface/catalog";

export const CatalogApi = {
    getCategories: async (params: CategoriesParams) => {
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

        return callApi(url)
    },
    getCategoriesTree: async (params: { IsActive: boolean }) => {
        const query = new URLSearchParams()
        query.append("IsActive", params.IsActive.toString())
        const url = `${ApiRouters.CATEGORIES}/tree?${query.toString()}`
        return callApi(url)
    },
    getProducts: async (params: ProductsParams) => {
        const query = new URLSearchParams()
        if (params.Search) query.append("Search", params.Search.toString())
        if (params.CategoryId) query.append("CategoryId", params.CategoryId.toString())
        if (params.CategorySlug) query.append("CategorySlug", params.CategorySlug.toString())
        if (params.IsActive) query.append("IsActive", params.IsActive.toString())
        if (params.SortBy) query.append("SortBy", params.SortBy.toString())
        if (params.IsDescending !== undefined) query.append("IsDescending", params.IsDescending.toString())
        if (params.Page) query.append("Page", params.Page.toString())
        if (params.PageSize) query.append("PageSize", params.PageSize.toString())

        const url = `${ApiRouters.PRODUCTS}?${query.toString()}`

        return callApi(url)
    }
}