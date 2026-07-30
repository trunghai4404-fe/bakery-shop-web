'use client'

import AboutHeader from "@/components/layouts/aboutHeader"
import PageContainer from "@/components/layouts/page-container"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <AboutHeader />
            <main className="w-full flex-1">
                <PageContainer>
                    {children}
                </PageContainer>
            </main>
        </div>
    )
}