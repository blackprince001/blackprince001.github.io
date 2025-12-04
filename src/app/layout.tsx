import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local";
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const pagella = localFont({
  src: [
    {
      path: "../fonts/texgyrepagella-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/texgyrepagella-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/texgyrepagella-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/texgyrepagella-bolditalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
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
    <html lang="en" suppressHydrationWarning className={pagella.variable}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", pagella.variable)}>
        <div className="Root flex min-h-screen flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <script async src="https://0.observe.so/script.js" data-app="cm1ox74dc01sga2mnzpda7460"></script>
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

