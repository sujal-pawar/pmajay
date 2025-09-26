import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Eye, 
  Zap, 
  Shield, 
  BarChart3, 
  Clock, 
  Users, 
  FileText,
  Network,
  Target
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Database,
      title: "Centralized Agency Repository",
      description: "Comprehensive database of all implementing and executing agencies across Central, State, District, and Local levels",
      benefits: ["Single source of truth", "Real-time updates", "Role clarity"]
    },
    {
      icon: Eye,
      title: "Enhanced Transparency",
      description: "Complete visibility into fund flow, project timelines, and agency responsibilities for all stakeholders",
      benefits: ["Public accountability", "Progress tracking", "Decision visibility"]
    },
    {
      icon: Zap,
      title: "Streamlined Communication",
      description: "Digital channels for seamless coordination between Centre, States/UTs, and executing agencies",
      benefits: ["Reduced delays", "Clear protocols", "Efficient workflows"]
    },
    {
      icon: BarChart3,
      title: "Real-time Monitoring",
      description: "Live dashboards tracking project progress, fund utilization, and performance metrics across components",
      benefits: ["Data-driven insights", "Early warnings", "Performance analytics"]
    },
    {
      icon: Shield,
      title: "Improved Accountability",
      description: "Clear assignment of responsibilities and performance tracking for better implementation oversight",
      benefits: ["Role clarity", "Performance metrics", "Audit trails"]
    },
    {
      icon: Clock,
      title: "Faster Approvals",
      description: "Digitized approval processes reducing administrative delays and accelerating project implementation",
      benefits: ["Automated workflows", "Quick turnaround", "Process optimization"]
    }
  ];

  const systemCapabilities = [
    {
      icon: Network,
      title: "Multi-Level Integration",
      description: "Seamless integration across Central, State, District, and Local administrative levels"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Centralized repository for all project documents, approvals, and communications"
    },
    {
      icon: Users,
      title: "Stakeholder Portal",
      description: "Dedicated access for different user roles with appropriate permissions and dashboards"
    },
    {
      icon: Target,
      title: "Performance Tracking",
      description: "Comprehensive metrics and KPIs for monitoring scheme implementation effectiveness"
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Digital Solution Features
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Transforming Agency Coordination
            <span className="text-primary block mt-2">Through Digital Innovation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive digital platform addresses coordination challenges through advanced 
            features designed for transparency, efficiency, and accountability.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border hover:shadow-govt transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Capabilities */}
        <div className="bg-gradient-subtle rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">System Capabilities</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced technical capabilities ensuring robust, scalable, and user-friendly agency mapping solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemCapabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-secondary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold mb-2">{capability.title}</h4>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;