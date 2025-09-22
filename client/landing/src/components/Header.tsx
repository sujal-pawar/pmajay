import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import governmentEmblem from "@/assets/government-emblem.png";

const navigation = [
  { name: "Home", href: "/" },
  { 
    name: "About", 
    href: "/about",
    hasDropdown: true 
  },
  { 
    name: "Reports", 
    href: "/reports",
    hasDropdown: true,
    isNew: true 
  },
  { 
    name: "Gallery", 
    href: "/gallery",
    hasDropdown: true 
  },
  { 
    name: "Downloads", 
    href: "/downloads",
    hasDropdown: true 
  },
  { name: "Find Course", href: "/find-course" },
  { name: "Contact Us", href: "/contact" },
];

export function Header() {
  const location = useLocation();

  return (
    <>
      {/* Top Government Bar */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm">
            <div className="flex items-center space-x-4">
              <img 
                src={governmentEmblem} 
                alt="Government of India" 
                className="h-8 w-8"
              />
              <div>
                <div className="font-medium text-foreground">
                  Ministry of Social Justice and Empowerment
                </div>
                <div className="text-muted-foreground text-xs">
                  Government of India
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Screen Reader</span>
              <span className="text-muted-foreground">A+</span>
              <span className="text-muted-foreground">A</span>
              <span className="text-muted-foreground">A-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Title Section */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-6">
              <img 
                src={governmentEmblem} 
                alt="PM-AJAY Logo" 
                className="h-20 w-20"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Pradhan Mantri Anusuchit Jaati Abhyuday Yojna
                </h1>
                <p className="text-lg font-medium text-primary mb-1">(PM-AJAY)</p>
                <p className="text-sm text-muted-foreground">
                  Department of Social Justice & Empowerment
                </p>
                <p className="text-sm text-muted-foreground">Government of India</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img 
                src={governmentEmblem} 
                alt="Azadi Ka Amrit Mahotsav" 
                className="h-16 w-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-primary shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  <button
                    className={`
                      flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors
                      ${location.pathname === item.href 
                        ? 'text-primary-foreground bg-primary-dark rounded-md' 
                        : 'text-primary-foreground hover:text-primary-foreground hover:bg-primary-dark rounded-md'
                      }
                    `}
                  >
                    <span>{item.name}</span>
                    {item.isNew && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-sm font-bold">
                        New
                      </span>
                    )}
                    {item.hasDropdown && (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary-foreground text-primary-foreground bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}