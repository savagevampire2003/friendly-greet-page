import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Globe } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every detail crafted with care and attention to create something beautiful."
    },
    {
      icon: Sparkles,
      title: "Simply Magical",
      description: "Experience the wonder of seamless design and intuitive interactions."
    },
    {
      icon: Globe,
      title: "Globally Connected",
      description: "Bringing people together from all corners of the world with technology."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Why We Say Hello
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every greeting is the beginning of something wonderful. Here's what makes our hello special.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-soft)] hover:-translate-y-2 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;