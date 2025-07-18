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
  title: "Fresh Meat & Fish - Premium Quality Delivered",
  description:
    "Order fresh meat and fish online. Premium quality, fast delivery, best prices.",
  generator: "v0.dev",
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
