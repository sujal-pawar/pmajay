import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface SchemeCardProps {
  number: string;
  title: string;
  description?: string;
  color: "green" | "teal" | "red" | "purple" | "blue" | "orange";
  className?: string;
}

const colorVariants = {
  green: "bg-gov-green text-white",
  teal: "bg-gov-teal text-white", 
  red: "bg-gov-red text-white",
  purple: "bg-gov-purple text-white",
  blue: "bg-gov-blue text-white",
  orange: "bg-gov-orange text-white",
};

export function SchemeCard({ number, title, description, color, className }: SchemeCardProps) {
  return (
    <Card className={cn("flex items-center space-x-4 p-4 shadow-card hover:shadow-elevated transition-shadow", className)}>
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg",
        colorVariants[color]
      )}>
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>
    </Card>
  );
}