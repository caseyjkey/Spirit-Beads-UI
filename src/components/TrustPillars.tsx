import { Heart, Users, Shield } from "lucide-react";

export const TrustPillars = () => {
  const pillars = [
    {
      icon: Heart,
      title: "Authentic Artistry",
      description: "Hand-beaded with traditional techniques."
    },
    {
      icon: Users,
      title: "Native Owned",
      description: "Supporting Indigenous creators."
    },
    {
      icon: Shield,
      title: "Secure Transit",
      description: "Shipped in protective jewelry boxes."
    }
  ];

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Why Choose Us</h3>
      </div>
      <div className="space-y-4">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <div key={index} className="flex items-center space-x-3 text-center">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{pillar.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
