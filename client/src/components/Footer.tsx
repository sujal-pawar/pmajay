import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import govtEmblem from "@/assets/govt-emblem.png";

const Footer = () => {
  const quickLinks = [
    { name: "PM-AJAY Portal", href: "https://pmajay.dosje.gov.in/" },
    { name: "PMAGY Portal", href: "https://pmagy.gov.in/" },
    { name: "Ministry of Social Justice", href: "https://socialjustice.gov.in/" },
    { name: "Digital India", href: "https://digitalindia.gov.in/" },
  ];

  const governmentLinks = [
    { name: "Prime Minister's Office", href: "https://www.pmindia.gov.in/" },
    { name: "Government of India", href: "https://www.india.gov.in/" },
    { name: "MyGov Platform", href: "https://www.mygov.in/" },
    { name: "National Portal", href: "https://www.india.gov.in/" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Government Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={govtEmblem} 
                alt="Government of India" 
                className="h-12 w-12 bg-white rounded-full p-1"
              />
              <div>
                <h3 className="font-bold text-lg">PM-AJAY</h3>
                <p className="text-sm text-primary-foreground/80">Government of India</p>
              </div>
            </div>
            <p className="text-primary-foreground/90 text-sm mb-4">
              Digital initiative for mapping implementing and executing agencies across 
              PM-AJAY components to enhance coordination and transparency.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-foreground/70" />
                <span>pmajay@gov.in</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary-foreground/70" />
                <span>+91-11-2338-XXXX</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">PM-AJAY Portals</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-foreground/90 hover:text-primary-foreground transition-colors text-sm"
                >
                  {link.name}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Government Links */}
          <div>
            <h4 className="font-semibold mb-6">Government Links</h4>
            <div className="space-y-3">
              {governmentLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-foreground/90 hover:text-primary-foreground transition-colors text-sm"
                >
                  {link.name}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Ministry Information */}
          <div>
            <h4 className="font-semibold mb-6">Ministry Information</h4>
            <div className="space-y-4 text-sm">
              <div>
                <h5 className="font-medium text-primary-foreground mb-2">
                  Ministry of Social Justice & Empowerment
                </h5>
                <div className="flex items-start space-x-2 text-primary-foreground/90">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Shastri Bhawan, Dr. Rajendra Prasad Road,<br />
                    New Delhi - 110001
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary-light/30">
                <p className="text-primary-foreground/80 text-xs">
                  Developed by National Informatics Centre (NIC)<br />
                  Ministry of Electronics & Information Technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-light/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-primary-foreground/80">
              <span>© 2025 Government of India. All rights reserved.</span>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary-foreground">Privacy Policy</a>
                <a href="#" className="hover:text-primary-foreground">Terms of Use</a>
                <a href="#" className="hover:text-primary-foreground">RTI</a>
                <a href="#" className="hover:text-primary-foreground">Accessibility</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-primary-foreground/80">Last Updated: September 26, 2025</span>
              <div className="bg-primary-light/20 px-3 py-1 rounded-full">
                <span className="text-xs">Beta Version</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;