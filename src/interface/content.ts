export enum BannerActionType {
    None = "None",
    ExternalLink = "ExternalLink",
    InternalRoute = "InternalRoute",
    Product = "Product",
    Category = "Category",
    Promotion = "Promotion",
    ApplyVoucher = "ApplyVoucher"
}

export interface BannerResponse {
    id: string
    title: string
    imageUrl: string
    mobileImageUrl: string
    actionType: string
    actionTypeValue: number
    targetValue: string
    openInNewTab: boolean
    isActive: boolean
    status: string
    statusValue: number
    startDate: string
    endDate: string | null
    metadata: string
    createdAt: string
    lastModifiedAt: string | null
}

