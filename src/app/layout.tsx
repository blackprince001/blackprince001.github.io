import type { Metadata } from "next";
import local from "next/font/local";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const graphik = local({
  src: [
    {
      path: "../../public/fonts/Graphik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Graphik-Medium.ttf",
      weight: "600",
      style: "bold",
    },
  ],
  variable: "--font-graphik",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={graphik.className}>
        <Navbar />
        <div className="py-[10vh] max-w-3xl mx-auto p-6">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
