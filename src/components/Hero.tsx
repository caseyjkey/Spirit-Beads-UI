import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import hero1 from "@/assets/hero/hero-1.png";
import hero2 from "@/assets/hero/hero-2.png";
import hero3 from "@/assets/hero/hero-3.png";
import thread from "@/assets/hero/thread.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden pt-16">
      {/* Thread Background - Full Hero Section */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={thread}
          alt="Traditional beadwork thread and needle"
          className="absolute w-4/5 h-4/5 object-contain opacity-20"
          style={{
            transform: 'rotate(-5deg)'
          }}
        />
      </div>

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

          {/* Hero Image Cluster */}
          <div className="relative order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-xl">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-accent rounded-full blur-3xl opacity-20 scale-75" />

              {/* Background Lighters */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Left Background Lighter */}
                <img
                  src={hero2}
                  alt="Handmade beaded lighter case"
                  className="absolute w-24 md:w-32 lg:w-40 h-auto object-contain opacity-60 blur-sm animate-float"
                  style={{
                    left: '20%',
                    transform: 'translateY(-50%)',
                    filter: 'brightness(0.85)',
                    animationDelay: '0.2s',
                    rotate: '-15deg'
                  }}
                />

                {/* Right Background Lighter */}
                <img
                  src={hero3}
                  alt="Handmade beaded lighter case"
                  className="absolute w-24 md:w-32 lg:w-40 h-auto object-contain opacity-60 blur-sm animate-float"
                  style={{
                    right: '20%',
                    transform: 'translateY(-50%)',
                    filter: 'brightness(0.85)',
                    animationDelay: '0.4s',
                    rotate: '15deg'
                  }}
                />
              </div>

              {/* Main Front Lighter */}
              <div className="relative flex justify-center">
                <img
                  src={hero1}
                  alt="Handmade beaded lighter case with traditional Native American patterns"
                  className="relative w-32 md:w-40 lg:w-48 h-auto object-contain animate-float drop-shadow-2xl z-10"
                />
              </div>

              {/* Floating Badge - Positioned relative to front lighter */}
              <div className="absolute bottom-4 left-1/2 translate-x-1/2 bg-card p-4 rounded-lg shadow-medium animate-fade-in z-20" style={{ animationDelay: "0.5s", transform: 'translateX(60%)' }}>
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
