import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Users, Building, GraduationCap, Briefcase, Hammer } from "lucide-react";

const Components = () => {
  const components = [
    {
      id: "adarsh-gram",
      title: "Adarsh Gram",
      subtitle: "Model Village Development",
      icon: Home,
      color: "primary",
      description: "Development of SC dominated villages into comprehensive model villages with all basic amenities and infrastructure.",
      features: [
        "Drinking Water & Sanitation",
        "Electricity & Clean Fuel",
        "Education Infrastructure", 
        "Health & Nutrition",
        "Rural Roads & Connectivity",
        "Livelihood & Housing",
        "Skill Development Programs",
        "Digital Infrastructure"
      ],
      stats: {
        villages: "1,500+",
        beneficiaries: "2.5L+",
        completion: "75%"
      },
      website: "https://pmagy.gov.in"
    },
    {
      id: "gia",
      title: "Grants-in-Aid",
      subtitle: "State/District Support",
      icon: Briefcase,
      color: "secondary",
      description: "Financial assistance to States/Districts for implementing targeted interventions for SC community development.",
      features: [
        "Infrastructure Development",
        "Income Generation Activities", 
        "Skill Development Projects",
        "Comprehensive Livelihood Projects",
        "Common Utility Infrastructure",
        "Training & Capacity Building"
      ],
      stats: {
        projects: "500+",
        states: "36",
        funding: "₹2,500Cr"
      },
      website: "https://pmajay.dosje.gov.in"
    },
    {
      id: "hostels",
      title: "Hostel Component",
      subtitle: "Educational Infrastructure",
      icon: Building,
      color: "accent",
      description: "Construction and repair of hostels to provide residential facilities for SC students pursuing education.",
      features: [
        "New Hostel Construction",
        "Renovation of Existing Hostels",
        "Modern Amenities Installation",
        "Safety & Security Measures",
        "Digital Learning Infrastructure",
        "Mess & Kitchen Facilities"
      ],
      stats: {
        hostels: "250+",
        students: "50K+",
        capacity: "75K"
      },
      website: "https://pmajay.dosje.gov.in"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary/5",
          border: "border-primary/20",
          icon: "text-primary",
          badge: "bg-primary text-primary-foreground"
        };
      case "secondary":
        return {
          bg: "bg-secondary/5",
          border: "border-secondary/20", 
          icon: "text-secondary",
          badge: "bg-secondary text-secondary-foreground"
        };
      case "accent":
        return {
          bg: "bg-accent/5",
          border: "border-accent/20",
          icon: "text-accent", 
          badge: "bg-accent text-accent-foreground"
        };
      default:
        return {
          bg: "bg-primary/5",
          border: "border-primary/20",
          icon: "text-primary",
          badge: "bg-primary text-primary-foreground"
        };
    }
  };

  return (
    <section id="components" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Three Integrated Components
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            PM-AJAY 
            <span className="text-primary block mt-2">Component Overview</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each component addresses specific aspects of socio-economic development with dedicated 
            implementing and executing agencies at various administrative levels.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {components.map((component) => {
            const colorClasses = getColorClasses(component.color);
            const Icon = component.icon;
            
            return (
              <Card key={component.id} className={`${colorClasses.bg} ${colorClasses.border} border-2 hover:shadow-govt transition-all duration-300`}>
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} border ${colorClasses.border} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
                    </div>
                    <Badge className={colorClasses.badge}>
                      Component {component.id === "adarsh-gram" ? "I" : component.id === "gia" ? "II" : "III"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{component.title}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">{component.subtitle}</p>
                  <p className="text-sm text-muted-foreground mt-3">{component.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {component.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className={`w-1.5 h-1.5 rounded-full mr-3 ${colorClasses.icon.replace('text-', 'bg-')}`}></span>
                          {feature}
                        </div>
                      ))}
                      {component.features.length > 4 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          +{component.features.length - 4} more features
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Hammer className="w-4 h-4 mr-2 text-muted-foreground" />
                      Progress Stats
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(component.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className={`text-lg font-bold ${colorClasses.icon}`}>{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className={`w-full ${colorClasses.border} ${colorClasses.icon} hover:${colorClasses.bg}`}
                    asChild
                  >
                    <a href={component.website} target="_blank" rel="noopener noreferrer">
                      Visit Portal
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Agency Mapping Call-to-Action */}
        <div className="mt-16 bg-gradient-govt rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl font-bold text-primary-foreground mb-4">
            Comprehensive Agency Mapping Across All Components
          </h3>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Our digital platform maps implementing and executing agencies for all three components, 
            providing real-time visibility into roles, responsibilities, and coordination mechanisms.
          </p>
          <Button size="lg" variant="secondary" className="shadow-card">
            <Users className="w-5 h-5 mr-2" />
            View Agency Directory
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Components;