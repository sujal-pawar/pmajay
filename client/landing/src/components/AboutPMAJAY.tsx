import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Building2, AlertCircle } from "lucide-react";

const AboutPMAJAY = () => {
  const impactGoals = [
    "Streamlined communication and coordination between all stakeholders",
    "Digital repository of agencies with defined roles for faster decision-making", 
    "Optimized fund flow and timely release of approvals",
    "Improved accountability and better implementation oversight"
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Impact Goals Section */}
        <div className="bg-gradient-govt rounded-2xl p-8 lg:p-12 text-center max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-6 text-primary-foreground border-primary-foreground/30">
            PM-AJAY Digital Initiative
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Expected Impact & Implementation Goals
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive digital platform addresses coordination challenges through strategic 
            implementation of agency mapping across all PM-AJAY components.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {impactGoals.map((goal, index) => (
              <div key={index} className="flex items-start space-x-3 text-left">
                <div className="bg-primary-foreground/20 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-primary-foreground">{index + 1}</span>
                </div>
                <p className="text-primary-foreground/90">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPMAJAY;