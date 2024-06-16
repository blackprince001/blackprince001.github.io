import { Metadata } from "next";
import "katex/dist/katex.min.css";

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
      siteName: "blackprince001.github.io",
      images: [
        {
          url: "https://blackprince001.github.io/images/blog.png",
          width: 800,
          height: 600,
        },
        {
          url: "https://blackprince001.github.io/images/blog.png",
          width: 1800,
          height: 1600,
          alt: "blackprince/blog-post",
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
    <div>
      {children}
    </div>
  );
}
