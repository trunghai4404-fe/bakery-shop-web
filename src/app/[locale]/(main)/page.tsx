import { CatalogApi } from "@/actions/catalog";
import Homepage from "@/views/homepage";

export default async function Home() {
    let categories = [];
    try {
        const res: any = await CatalogApi.getCategories({
            IsFeatured: true,
            IsActive: true,
            PageSize: 10,
        });
        categories =
            res?.data?.items;
    } catch (err) {
        console.error("Failed to fetch categories on server:", err);
    }

    return <Homepage categories={categories} />;
}
