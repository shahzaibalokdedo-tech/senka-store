import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://senka.com"),
  title: {
    default: "Senka | Luxury Fashion Studio",
    template: "%s | Senka"
  },
  description: "Luxury jewellery and fashion studio in Pakistan.",
  keywords: [
    "Senka",
    "luxury jewellery Pakistan",
    "fashion studio",
    "premium jewellery",
    "jewellery brand"
  ],
  openGraph: {
    title: "Senka | Luxury Fashion Studio",
    description: "Luxury jewellery and fashion studio in Pakistan.",
    type: "website",
    siteName: "Senka"
  },
  twitter: {
    card: "summary_large_image",
    title: "Senka | Luxury Fashion Studio",
    description: "Luxury jewellery and fashion studio in Pakistan."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
