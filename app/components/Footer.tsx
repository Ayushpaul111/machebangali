"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Branding Section - Always First */}
          <div className="order-1 md:order-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Mache Bangali
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed md:max-w-xs">
              Bringing fresh meat and fish straight to your doorstep hygienic
              and high-quality.
            </p>
          </div>

          {/* Category Section - Always Second */}
          <div className="order-2 md:order-2">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Shop by Category
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/category/meat"
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span className="mr-2">🥩</span> Fresh Meat
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fish"
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span className="mr-2">🐟</span> Fresh Fish
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section - Always Third */}
          <div className="order-3 md:order-3">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-x-3 text-gray-600">
                <MapPin className="h-5 w-5 text-red-600" />
                <span>Complex Gate, Mini Bus Stand, Cooch Behar</span>
              </li>
              <li className="flex items-start gap-x-3 text-gray-600">
                <Phone className="h-5 w-5 text-red-600" />
                <a
                  href="tel:+919732266082"
                  className="hover:text-red-600 transition-colors"
                >
                  +91 97322 66082
                </a>
              </li>
              <li className="flex items-start gap-x-3 text-gray-600">
                <Mail className="h-5 w-5 text-red-600" />
                <a
                  href="mailto:contact@ayushpaul.dev"
                  className="hover:text-red-600 transition-colors"
                >
                  contact@ayushpaul.dev
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-center items-center text-sm text-gray-500 gap-y-4">
          <p>
            &copy; {new Date().getFullYear()} Created with &lt;3 by{" "}
            <a
              href="https://ayushpaul.dev"
              className="bg-clip-text text-transparent bg-gradient-to-br from-[#723FCD] to-[#DB9FF5] font-semibold"
            >
              Ehike
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
