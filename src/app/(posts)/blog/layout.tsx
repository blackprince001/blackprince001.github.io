import { Metadata } from "next";

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
    <div>
      {children}
    </div>
  );
}
