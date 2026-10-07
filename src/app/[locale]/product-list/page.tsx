import { CatalogApi } from "@/actions/catalog";
import ProductList from "@/views/product-list/ProductList";
import { CategoriesTree } from "@/interface/catalog";

export default async function ProductListPage() {
    let initialCategoryTree: CategoriesTree[] = [];

    try {
        const res = await CatalogApi.getCategoriesTree({ IsActive: true });
        const rawItems = res?.data ?? res?.items;
        if (Array.isArray(rawItems)) {
            initialCategoryTree = rawItems;
        }
    } catch (err) {
        console.error("Failed to fetch categories tree on server:", err);
    }

    return <ProductList initialCategoryTree={initialCategoryTree} />;
}

