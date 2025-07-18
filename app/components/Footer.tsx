"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Categories Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shop by Category
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/meat"
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🥩</span>
                  Fresh Meat
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fish"
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🐟</span>
                  Fresh Fish
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mache Bangali
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                <span>Complex Gate, Mini Bus Stand, Cooch Behar</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2 text-red-600" />
                <a
                  href="tel:+919732266082"
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  +91 97322 66082
                </a>
              </li>
              <li className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2 text-red-600" />
                <a
                  href="mailto:contact@ayushpaul.dev"
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  contact@ayushpaul.dev
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-600">
            <p className="text-sm">
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://ayushpaul.dev"
                className="bg-clip-text text-transparent bg-gradient-to-br from-[#723FCD] to-[#DB9FF5] font-bold italic min-w-fit"
              >
                Ehike
              </a>
              . All rights reserved.
            </p>
            {/* <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="text-sm hover:text-red-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm hover:text-red-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
