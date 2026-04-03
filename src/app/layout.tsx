import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { ThemeProvider } from "@/components/theme-provider"
import UmamiAnalytics from "@/components/umami-analytics"
import { cn } from "@/lib/utils";

const fontPrimary = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning className={cn(fontPrimary.variable, fontMono.variable)}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontPrimary.variable, fontMono.variable)}>
        <div className="Root flex min-h-screen flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <UmamiAnalytics />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}

