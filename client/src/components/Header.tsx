import { useState } from "react";
import { Menu, X, ExternalLink, Link, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import govtEmblem from "@/assets/govt-emblem.png";
import azadi75Logo from "@/assets/azadi75-logo.png";
import pmAjayLogo from "@/assets/pm-ajay logo.png";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About PM-AJAY", href: "#about" },
    { name: "Components", href: "#components" },
    { name: "Progress", href: "#progress" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Top Government Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src={pmAjayLogo} 
                alt="PM-AJAY Logo" 
                className="h-10 w-10 sm:h-16 sm:w-16 object-contain bg-white rounded-full p-1 shadow-md flex-shrink-0"
              />
              <div className="text-white min-w-0">
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold leading-tight truncate sm:whitespace-normal">
                  Pradhan Mantri Anusuchit Jaati Abhyuday Yojna
                </h1>
                <h2 className="text-xs sm:text-lg md:text-xl font-semibold text-orange-200 mb-0 sm:mb-1 truncate sm:whitespace-normal">
                  (PM-AJAY)
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed hidden sm:block">
                  Department of Social Justice & Empowerment, Ministry of Social Justice and Empowerment
                </p>
                <p className="text-xs md:text-sm text-blue-200 font-medium hidden sm:block">
                  Government of India
                </p>
                {/* Mobile-only compact info */}
                <p className="text-xs text-blue-200 sm:hidden">
                  Ministry of Social Justice and Empowerment
                </p>
              </div>
            </div>
            
            {/* Right Section - Azadi Logo */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <img 
                src={azadi75Logo} 
                alt="Azadi Ka Amrit Mahotsav" 
                className="h-16 xl:h-20 w-auto object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Mobile Azadi Logo */}
            <div className="flex lg:hidden items-center flex-shrink-0">
              <img 
                src={azadi75Logo} 
                alt="Azadi Ka Amrit Mahotsav" 
                className="h-8 sm:h-12 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a 
                href="/" 
                className="text-blue-900 hover:text-orange-600 font-semibold px-3 py-2 rounded-md transition-colors duration-200 border-b-2 border-blue-900 text-sm xl:text-base"
              >
                Home
              </a>
              <a 
                href="/about" 
                className="text-gray-700 hover:text-blue-900 font-medium px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50 text-sm xl:text-base"
              >
                About Us
              </a>
              <a 
                href="/contact" 
                className="text-gray-700 hover:text-blue-900 font-medium px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50 text-sm xl:text-base"
              >
                Contact Us
              </a>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="hidden lg:flex items-center space-x-2 bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-md">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium text-blue-900 truncate max-w-24 sm:max-w-none">{user.name}</span>
                    <span className="hidden xl:inline-block text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <Button 
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-md shadow-md transition-all duration-200 hover:shadow-lg text-xs sm:text-sm"
                  >
                    <a href="/dashboard">Dashboard</a>
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-all duration-200 text-xs sm:text-sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden md:inline">Logout</span>
                    <span className="md:hidden">Exit</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    asChild
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 sm:px-6 py-1 sm:py-2 rounded-md shadow-md transition-all duration-200 hover:shadow-lg text-xs sm:text-sm"
                  >
                    <a href="/login">Login</a>
                  </Button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-200"
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? (
                  <X className="block h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="block h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg">
                {user && (
                  <div className="px-3 py-2 mb-2 bg-blue-50 rounded-md border-l-4 border-blue-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-blue-900 truncate">{user.name}</span>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
                      {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                )}
                <a
                  href="/"
                  className="text-blue-900 block px-3 py-2 rounded-md text-base font-semibold bg-blue-50 border-l-4 border-blue-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-blue-900 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </a>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-blue-900 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </a>
                {user && (
                  <>
                    <a
                      href="/dashboard"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </>
                )}
                {!user && (
                  <a
                    href="/login"
                    className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 border-l-4 border-orange-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;