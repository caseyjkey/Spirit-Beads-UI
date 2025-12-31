import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroProduct from "@/assets/products/lighter-case-1.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden pt-16">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              hsl(var(--deep-brown)) 20px,
              hsl(var(--deep-brown)) 21px
            )`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-body text-sm font-medium text-accent">
                Native American Owned
              </span>
            </div>

            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Handcrafted
              <br />
              <span className="text-primary">Beaded Art</span>
              <br />
              You Can Carry
            </h1>

            <p
              className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0 mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Each lighter case is a unique piece of traditional beadwork, 
              handmade with love and passed-down techniques. Support 
              Indigenous artistry with every purchase.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button variant="hero" size="xl" asChild>
                <a href="#collection">Shop Collection</a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#about">Our Story</a>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 md:order-2 flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-accent rounded-full blur-3xl opacity-20 scale-75" />
              
              <img
                src={heroProduct}
                alt="Handmade beaded lighter case with traditional Native American patterns"
                className="relative w-64 md:w-80 lg:w-96 h-auto object-contain animate-float drop-shadow-2xl"
              />

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 md:bottom-4 md:-right-8 bg-card p-4 rounded-lg shadow-medium animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <p className="font-display text-2xl font-semibold text-primary">100%</p>
                <p className="font-body text-sm text-muted-foreground">Handmade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <a href="#collection" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowDown className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
