import { useState } from "react";
import { Menu, X, ExternalLink, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import govtEmblem from "@/assets/govt-emblem.png";
import azadi75Logo from "@/assets/azadi75-logo.png";
import pmAjayLogo from "@/assets/pm-ajay logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About PM-AJAY", href: "#about" },
    { name: "Components", href: "#components" },
    { name: "Progress", href: "#progress" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Top Government Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo and Title */}
            <div className="flex items-center space-x-4">
              <img 
                src={pmAjayLogo} 
                alt="PM-AJAY Logo" 
                className="h-16 w-16 object-contain bg-white rounded-full p-1 shadow-md"
              />
              <div className="text-white">
                <h1 className="text-xl md:text-2xl font-bold leading-tight">
                  Pradhan Mantri Anusuchit Jaati Abhyuday Yojna
                </h1>
                <h2 className="text-lg md:text-xl font-semibold text-orange-200 mb-1">
                  (PM-AJAY)
                </h2>
                <p className="text-sm md:text-base text-blue-100 leading-relaxed">
                  Department of Social Justice & Empowerment, Ministry of Social Justice and Empowerment
                </p>
                <p className="text-xs md:text-sm text-blue-200 font-medium">
                  Government of India
                </p>
              </div>
            </div>
            
            {/* Right Section - Azadi Logo */}
            <div className="hidden md:flex items-center">
              <img 
                src={azadi75Logo} 
                alt="Azadi Ka Amrit Mahotsav" 
                className="h-20 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="/" 
                className="text-blue-900 hover:text-orange-600 font-semibold px-3 py-2 rounded-md transition-colors duration-200 border-b-2 border-blue-900"
              >
                Home
              </a>
              <a 
                href="/about" 
                className="text-gray-700 hover:text-blue-900 font-medium px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50"
              >
                About Us
              </a>
              <a 
                href="/contact" 
                className="text-gray-700 hover:text-blue-900 font-medium px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50"
              >
                Contact Us
              </a>
            </div>

            {/* Login Button and Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <Button 
                asChild
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <a href="/login">Login</a>
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-200"
                aria-expanded="false"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg">
                <a
                  href="/"
                  className="text-blue-900 block px-3 py-2 rounded-md text-base font-semibold bg-blue-50 border-l-4 border-blue-900"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-blue-900 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  About Us
                </a>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-blue-900 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;