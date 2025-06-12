'use client';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">EHB</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="/gosellr" className="text-gray-700 hover:text-blue-600">
              GoSellr
            </a>
            <a href="/edr" className="text-gray-700 hover:text-blue-600">
              EDR
            </a>
            <a href="/emo" className="text-gray-700 hover:text-blue-600">
              EMO
            </a>
            <a href="/jps" className="text-gray-700 hover:text-blue-600">
              JPS
            </a>
            <a href="/pss" className="text-gray-700 hover:text-blue-600">
              PSS
            </a>
            <a href="/franchise" className="text-gray-700 hover:text-blue-600">
              Franchise
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="/gosellr" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              GoSellr
            </a>
            <a href="/edr" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              EDR
            </a>
            <a href="/emo" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              EMO
            </a>
            <a href="/jps" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              JPS
            </a>
            <a href="/pss" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              PSS
            </a>
            <a href="/franchise" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              Franchise
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
