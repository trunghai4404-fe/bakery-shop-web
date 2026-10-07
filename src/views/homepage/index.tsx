import { CategoryInterface } from "@/interface/catalog";
import ProductSection from "./Components/ProductSection";
import { Cake, Sparkles, Clock, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

interface HomepageProps {
    categories?: CategoryInterface[];
}

const Homepage = ({ categories = [] }: HomepageProps) => {
    return (
        <div className="flex flex-col min-h-screen bg-surface">
            <section className="relative overflow-hidden bg-linear-to-b from-surface-container-low via-surface to-surface py-12 lg:py-20 border-b border-outline-variant/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container/60 text-on-primary-container text-xs font-semibold border border-primary/20 shadow-xs">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                <span>Tiệm Bánh Tươi Mỗi Ngày • Bakery Premium</span>
                            </div>

                            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface leading-[1.15]">
                                Hương vị ngọt ngào <br />
                                <span className="text-primary font-black">đong đầy yêu thương</span>
                            </h1>

                            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Khám phá thế giới bánh ngọt thủ công được nướng mới mỗi sáng từ những nguyên liệu hữu cơ chọn lọc. Giao hàng tận nơi nhanh chóng & tươi ngon trọn vị.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link
                                    href="/product-list"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
                                >
                                    <span>Khám phá sản phẩm</span>
                                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                                </Link>

                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/80 hover:bg-surface-container-low text-on-surface font-semibold text-sm transition-all duration-200 cursor-pointer"
                                >
                                    <span>Về chúng tôi</span>
                                </Link>
                            </div>

                            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-outline-variant/30 max-w-lg mx-auto lg:mx-0">
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <div className="flex items-center gap-1.5 text-secondary font-bold text-xs mb-1">
                                        <Clock className="h-3.5 w-3.5 stroke-2" />
                                        <span>Bánh Tươi 100%</span>
                                    </div>
                                    <span className="text-[11px] text-on-surface-variant">Nướng mới mỗi sáng</span>
                                </div>

                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <div className="flex items-center gap-1.5 text-secondary font-bold text-xs mb-1">
                                        <ShieldCheck className="h-3.5 w-3.5 stroke-2" />
                                        <span>Nguyên Liệu Sạch</span>
                                    </div>
                                    <span className="text-[11px] text-on-surface-variant">Hữu cơ cao cấp</span>
                                </div>

                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <div className="flex items-center gap-1.5 text-secondary font-bold text-xs mb-1">
                                        <Truck className="h-3.5 w-3.5 stroke-2" />
                                        <span>Giao Siêu Tốc</span>
                                    </div>
                                    <span className="text-[11px] text-on-surface-variant">Trong vòng 2 giờ</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-linear-to-tr from-primary-container/40 via-secondary-container/30 to-surface-container-high border border-outline-variant/40 p-6 shadow-xl flex flex-col items-center justify-center text-center">
                                <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
                                    <Cake className="h-12 w-12 stroke-[1.4]" />
                                </div>
                                <h3 className="font-heading text-xl font-bold text-on-surface mb-2">
                                    Bakery Shop Premium
                                </h3>
                                <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed mb-4">
                                    Bánh sinh nhật, bánh mì tươi & bánh ngọt cao cấp sẵn sàng phục vụ quý khách.
                                </p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-semibold">
                                    <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
                                    Đang mở cửa nhận đơn
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="space-y-4 py-6">
                {categories.length > 0 && (
                    categories.map((category) => (
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