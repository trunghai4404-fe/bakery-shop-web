import { cache } from "react";
import { CatalogApi } from "@/actions/catalog";
import ProductDetail from "@/views/product-detail/ProductDetail";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface ProductDetailPageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

const getProductDetailCached = cache(async (slug: string) => {
    return await CatalogApi.getProductBySlug(slug);
});

const getProductDetailWithRetry = async (slug: string, retries = 1) => {
    let lastError!: Error;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await getProductDetailCached(slug);
        } catch (error) {
            lastError = error as Error;
        }
    }

    throw lastError.message;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;

    let res;
    try {
        res = await getProductDetailWithRetry(slug);
    } catch {
        res = null;
    }

    const product = res?.data;

    if (!product) {
        notFound();
    }

    return <ProductDetail product={product} />;
}
