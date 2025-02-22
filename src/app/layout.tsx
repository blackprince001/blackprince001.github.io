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
      path: "../../public/fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Bold.ttf",
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
    images: [
      {
        url: "https://blackprince001.github.io/images/meta.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://blackprince001.github.io/images/meta.png",
        width: 1800,
        height: 1600,
        alt: "blackprince",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <script async src="https://0.observe.so/script.js" data-app="cm1ox74dc01sga2mnzpda7460"></script>
          <Navbar />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

