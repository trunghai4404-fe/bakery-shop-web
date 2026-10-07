'use client'

import HeaderNavigationWrapper from "@/components/HeaderNavigationWrapper"
import PageContainer from "@/components/layouts/page-container"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="w-full flex-1">
                <HeaderNavigationWrapper>
                    {children}
                </HeaderNavigationWrapper>
            </main>
        </div>
    )
}
