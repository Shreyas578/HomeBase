import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homebase | Qloo-Powered Relocation & Campus Taste Agent",
  description:
    "An autonomous AI agent powered by Qloo's taste graph, helping international students settle into new cities, make lifelong friends, and master hard subjects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700;1,900&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-[#0e1411] text-[#f2efe9] antialiased selection:bg-crimson-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
