// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "./machebangali.webp",
    shortcut: "./machebangali.webp",
    apple: "./machebangali.webp",
  },
  title:
    "Mache Bangali | Fresh Meat & Fish Delivery | Premium Quality in Cooch Behar",
  description:
    "Order fresh meat and fish online in Cooch Behar. Premium quality chicken, mutton, fish with same-day delivery. Best prices, freshest products guaranteed.",
  keywords:
    "fresh meat, fresh fish, chicken delivery, mutton delivery, fish delivery, Cooch Behar, online meat shop, premium quality meat",
  authors: [{ name: "Fresh Meat & Fish Store" }],
  category: "food",
  openGraph: {
    title: "Fresh Meat & Fish Delivery | Premium Quality in Cooch Behar",
    description:
      "Order fresh meat and fish online in Cooch Behar. Premium quality with same-day delivery.",
    type: "website",
    locale: "en_IN",
    siteName: "Fresh Meat & Fish Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Meat & Fish Delivery | Premium Quality in Cooch Behar",
    description:
      "Order fresh meat and fish online in Cooch Behar. Premium quality with same-day delivery.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProductProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Toaster />
            <Footer />
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
