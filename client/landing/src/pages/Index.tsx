import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { SchemeCard } from "@/components/ui/scheme-card";
import { Building2, Users, TrendingUp, FileText, Bell, ArrowRight } from "lucide-react";
import namoImage from "../../../src/assets/namo.jpeg";

const schemes = [
  { number: "01", title: "Sanctioned Hostel", color: "green" as const },
  { number: "04", title: "Second instalment", color: "purple" as const },
  { number: "02", title: "New Hostel", color: "teal" as const },
  { number: "05", title: "Repairs & Maintenance", color: "blue" as const },
  { number: "03", title: "Expansion Hostel", color: "red" as const },
  { number: "06", title: "One Time Grant", color: "orange" as const },
];

const components = [
  {
    icon: Building2,
    title: "Development of SC dominated villages under 'Adarsh Gram'",
    description: "An 'Adarsh Gram' is one wherein people have access to various basic services so that the minimum needs of all the sections of the community are met through comprehensive livelihood projects.",
  },
  {
    icon: TrendingUp,
    title: "Grants-in-aid to State/Districts",
    description: "The main objectives of this component are: i) To increase the income of the target population by way of comprehensive livelihood projects.",
  },
  {
    icon: Users,
    title: "Construction/Repair of Hostels",
    description: "The construction of hostels is one of the means to enable and encourage students belonging to Scheduled Castes (SC) to attain quality education. Such hostels are constructed for SC students.",
  },
];

const newsItems = [
  "Sanction Orders under GIA - ANDHRA PRADESH 2025-2026 (Published Date: 18 Sep 2025)",
  "Sanction Orders under GIA - CHANDIGARH 2024-2025 (Published Date: 18 Sep 2025)", 
  "Sanction Orders under GIA - MAHARASHTRA 2024-2025 (Published Date: 01 Jul 2025)",
  "Sanction Orders under GIA - TAMIL NADU 2025-2026 (Published Date: 25 Jun 2025)",
  "Sanction Orders under GIA - TRIPURA 2023-2024 (Published Date: 25 Jun 2025)",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Department of Social Justice and Empowerment
                </h2>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-8">
                Government of India
              </h3>
              
              <div className="flex justify-center">
                <img
                  src={namoImage}
                  alt="PM Modi"
                  className="w-auto h-96 rounded-lg shadow-elevated"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card className="h-full bg-primary text-primary-foreground shadow-elevated">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {components.map((component, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-primary-foreground text-primary p-3 rounded-lg flex-shrink-0">
                        <component.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{component.title}</h3>
                        <p className="text-primary-foreground/90 text-sm leading-relaxed">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full bg-card shadow-card">
                <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
                    <Bell className="h-6 w-6" />
                    <span>What's New</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {newsItems.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 group">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-foreground text-sm leading-relaxed group-hover:text-primary transition-colors cursor-pointer">
                            {item}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-elevated">
            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-center">
                Mapping of Implementing and Executing Agencies across PM-AJAY Components
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Background</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    PM-AJAY consists of three components—Adarsh Gram, GIA, and Hostel—implemented by State/UT governments and executed through multiple agencies.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Challenges</h3>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>• No centralized mapping of implementing agencies</li>
                    <li>• Coordination bottlenecks</li>
                    <li>• Lack of transparency on roles and timelines</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Constraints</h3>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>• Inconsistent communication between stakeholders</li>
                    <li>• No digital dashboard for monitoring</li>
                    <li>• Administrative delays in accountability</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Impact Goals</h3>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>• Streamlined communication</li>
                    <li>• Digital repository of agencies</li>
                    <li>• Optimized fund flow</li>
                    <li>• Improved accountability</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
                  Learn More About PM-AJAY
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                © 2025 Department of Social Justice and Empowerment, Government of India
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-secondary transition-colors">Terms of Service</a>
              <a href="/accessibility" className="hover:text-secondary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
