import { CatalogApi } from "@/actions/catalog";
import { ContentApi } from "@/actions/content";
import Homepage from "@/views/homepage";
import { BannerResponse } from "@/interface/content";
import { CategoryInterface } from "@/interface/catalog";

export default async function Home() {
    let categories: CategoryInterface[] = [];
    let banners: BannerResponse[] = [];

    const [catResult, bannerResult] = await Promise.allSettled([
        CatalogApi.getCategories({
            IsFeatured: true,
            IsActive: true,
            PageSize: 10,
        }),
        ContentApi.getBanners(),
    ]);

    if (catResult.status === "fulfilled") {
        categories = catResult.value?.data?.items || [];
    } else {
        console.error("Failed to fetch categories on server:", catResult.reason?.message || catResult.reason);
    }

    if (bannerResult.status === "fulfilled") {
        banners = bannerResult.value?.data || [];
    } else {
        console.error("Failed to fetch banners on server:", bannerResult.reason?.message || bannerResult.reason);
    }

    return <Homepage categories={categories} banners={banners} />;
}
