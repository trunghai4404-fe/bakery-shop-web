import Header from "@/components/layouts/header"
import { getTranslations } from "next-intl/server"

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-7xl mx-auto w-full">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-primary bg-primary/10 rounded-full dark:bg-primary/20">
            ⚡ KHỞI ĐỘNG CÙNG SPORTHUB
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl font-sans">
            Sân chơi đẳng cấp <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container">
              Chỉ với vài click
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Hệ thống đặt sân thể thao hiện đại giúp kết nối bạn với những địa điểm thể thao chất lượng hàng đầu. Tìm sân, đặt lịch và thanh toán tiện lợi chỉ trong 60 giây.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button className="h-10 px-5 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg active:scale-98">
              Đặt sân ngay
            </button>
            <button className="h-10 px-5 text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 cursor-pointer active:scale-98">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
