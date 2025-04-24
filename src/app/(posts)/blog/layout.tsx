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
    images:
    {
      url: "https://blackprince001.github.io/images/seo-image-post.png",
      width: 1130,
      height: 693,
      alt: "blackprince",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <script async src="https://0.observe.so/script.js" data-app="cm1ox74dc01sga2mnzpda7460"></script>
      {children}
    </div>
  );
}
