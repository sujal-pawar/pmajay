import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import govtEmblem from "@/assets/govt-emblem.png";

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
      {/* Top Government Bar */}
      <div className="bg-gray-100 text-gray-700 py-1 text-xs border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>भारत सरकार | Government of India</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Ministry of Social Justice & Empowerment</span>
            <a href="https://socialjustice.gov.in/" className="hover:underline flex items-center">
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-blue-600 shadow-lg border-b border-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-6">
              <img 
                src={govtEmblem} 
                alt="Government of India Emblem" 
                className="h-16 w-16"
              />
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-white">
                  Pradhan Mantri Anusuchit Jaati Abhyuday Yojana
                </h1>
                <h2 className="text-lg font-semibold text-blue-100">
                  (PM-AJAY)
                </h2>
                <p className="text-sm text-blue-200">
                  Department of Social Justice & Empowerment | Government of India
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-blue-200 transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
              <Button 
                variant="outline" 
                className="bg-white text-blue-600 border-white hover:bg-blue-50"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-blue-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-blue-700">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-blue-200 transition-colors py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <Button 
                  variant="outline" 
                  className="bg-white text-blue-600 border-white hover:bg-blue-50 w-fit"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = '/login';
                  }}
                >
                  Login
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;