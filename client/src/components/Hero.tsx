import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Building } from "lucide-react";
import pmModiPortrait from "@/assets/pm-modi-portrait.jpg";
import ruralDevelopment from "@/assets/rural-development.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-subtle py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4 mr-2" />
                Digital Agency Mapping Initiative
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Mapping Implementing & Executing Agencies for
                <span className="text-primary block mt-2">PM-AJAY Components</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Streamlining coordination between Central Government, States/UTs, and executing agencies 
                for enhanced transparency and efficient implementation of Adarsh Gram, GIA, and Hostel components.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Multi-Agency</div>
                  <div className="text-sm text-muted-foreground">Coordination</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Building className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold">Digital</div>
                  <div className="text-sm text-muted-foreground">Transparency</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">Real-time</div>
                  <div className="text-sm text-muted-foreground">Monitoring</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-govt hover:opacity-90 shadow-govt">
                Explore Agency Mapping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
                View Progress Dashboard
              </Button>
            </div>

            {/* PM Modi Quote Section */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-start space-x-4">
                <img 
                  src={pmModiPortrait} 
                  alt="Prime Minister Narendra Modi"
                  className="w-16 h-20 rounded-md object-cover"
                />
                <div>
                  <blockquote className="text-lg italic text-muted-foreground mb-2">
                    "Digital governance is the way forward for transparent and efficient public service delivery. 
                    Every scheme must reach the deserving beneficiary through seamless coordination."
                  </blockquote>
                  <cite className="text-primary font-semibold">
                    - Hon'ble Prime Minister, Shri Narendra Modi
                  </cite>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-govt">
              <img 
                src={ruralDevelopment} 
                alt="Rural Development Progress"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              
              {/* Floating Stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-card">
                  <div className="text-2xl font-bold text-primary">36</div>
                  <div className="text-sm text-muted-foreground">States/UTs</div>
                </div>
                <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-card">
                  <div className="text-2xl font-bold text-secondary">250+</div>
                  <div className="text-sm text-muted-foreground">Agencies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;