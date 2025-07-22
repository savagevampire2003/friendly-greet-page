import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import waveIcon from "@/assets/wave-icon.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-bg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
        {/* Wave Icon */}
        <div className="mb-8 animate-float">
          <img 
            src={waveIcon} 
            alt="Welcome wave" 
            className="w-24 h-24 mx-auto animate-glow"
          />
        </div>
        
        {/* Main Heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
          Hello, World!
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Welcome to our beautiful corner of the internet. We're delighted you're here!
        </p>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="default" 
            size="lg"
            className="bg-gradient-primary hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 text-lg px-8 py-6"
          >
            Learn More
          </Button>
        </div>
        
        {/* Decorative Elements */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto opacity-60">
          <div className="h-1 bg-gradient-primary rounded-full animate-pulse" />
          <div className="h-1 bg-gradient-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="h-1 bg-gradient-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary-glow/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-primary/15 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-primary-glow/40 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
    </section>
  );
};

export default HeroSection;