import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border/30 bg-card/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
          <span>for everyone who believes in the power of a simple hello</span>
        </div>
        <p className="text-sm text-muted-foreground/80">
          © 2024 Hello Website. Spreading joy one greeting at a time.
        </p>
      </div>
    </footer>
  );
};

export default Footer;