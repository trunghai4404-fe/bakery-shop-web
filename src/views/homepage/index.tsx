import { CategoryInterface } from "@/interface/catalog";
import { BannerResponse } from "@/interface/content";
import ProductSection from "./Components/ProductSection";
import Banner from "./Components/Banner";

interface HomepageProps {
    categories?: CategoryInterface[];
    banners?: BannerResponse[];
}

const Homepage = ({ categories = [], banners = [] }: HomepageProps) => {
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeBanners = Array.isArray(banners) ? banners : [];

    return (
        <div className="flex flex-col min-h-screen bg-surface">
            <Banner banners={safeBanners} />

            <div className="container-page">
                {safeCategories.length > 0 && (
                    safeCategories.map((category) => (
                        <ProductSection
                            key={category.id}
                            title={category.name}
                            description={category.description}
                            categoryId={category.id}
                            categorySlug={category.slug}
                            viewMoreLink={`/product-list?category=${category.slug}`}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Homepage;