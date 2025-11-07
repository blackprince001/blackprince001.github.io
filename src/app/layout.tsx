import type React from "react"
import type { Metadata } from "next"
import local from "next/font/local"
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = local({
  src: [
    {
      path: "../../public/fonts/source-sans3-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/source-sans-pro-semibold.ttf",
      weight: "600",
      style: "bold",
    },
  ],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "blackprince | Nebula",
  description: "Engineering Journal",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "blackprince",
    description: "Engineering Journal",
    url: "https://blackprince001.github.io",
    siteName: "blackprince",
    images:
    {
      url: "https://blackprince001.github.io/images/seo-image.png",
      width: 1130,
      height: 693,
      alt: "blackprince",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="min-h-screen bg-background text-foreground">
        <div className="Root flex min-h-screen flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <script async src="https://0.observe.so/script.js" data-app="cm1ox74dc01sga2mnzpda7460"></script>
            <Navbar />
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</div>
            </main>
            <Footer />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}

