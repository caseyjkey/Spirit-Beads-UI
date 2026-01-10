import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import hero1 from "@/assets/hero/hero-1.png";
import hero2 from "@/assets/hero/hero-2.png";
import hero3 from "@/assets/hero/hero-3.png";
import thread from "@/assets/hero/thread.png";

const Hero = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    // Set flag to prevent product loading during scroll
    window.dispatchEvent(new CustomEvent('prevent-load', { detail: { prevent: true } }));

    // Wait for DOM to settle, then scroll
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerHeight = window.innerWidth >= 768 ? 116 : 100;
        const vh = window.innerHeight;

        if (sectionId === 'collection') {
          // Scroll to 100vh to ensure entire hero section is out of view
          window.scrollTo({
            top: vh,
            behavior: 'smooth'
          });
        } else {
          // For about section: calculate position to fill viewport below header
          const rect = section.getBoundingClientRect();
          const currentScroll = window.scrollY || document.documentElement.scrollTop;
          const elementAbsolutePosition = rect.top + currentScroll;
          const targetScroll = elementAbsolutePosition - headerHeight;

          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }

        // Re-enable loading after scroll completes
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('prevent-load', { detail: { prevent: false } }));
        }, 1000);
      }
    }, 300);
  };

  return (
    <section className="relative min-h-[calc(100vh-100px)] md:min-h-0 md:h-[calc(100vh-116px)] flex items-center justify-center bg-gradient-hero overflow-hidden pb-12 md:pb-0">
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
                <a href="#collection" onClick={(e) => scrollToSection(e, 'collection')}>Shop Collection</a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>Our Story</a>
              </Button>
            </div>
          </div>

          {/* Hero Image Cluster */}
          <div className="relative order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-xl aspect-square flex items-center justify-center">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-accent rounded-full blur-3xl opacity-20 scale-75" />

              {/* Left Background Lighter */}
              <motion.img
                src={hero2}
                alt="Beaded lighter case"
                className="absolute w-32 md:w-40 lg:w-48 h-auto object-contain blur-[2px] opacity-60"
                style={{
                  left: '15%',
                  top: '51%',
                  x: '-15%',
                  y: '-50%',
                  rotate: -15,
                  filter: 'brightness(0.85)'
                }}
                animate={{
                  y: ['-50%', '-55%', '-50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Right Background Lighter */}
              <motion.img
                src={hero3}
                alt="Beaded lighter case"
                className="absolute w-32 md:w-40 lg:w-48 h-auto object-contain blur-[2px] opacity-60"
                style={{
                  right: '15%',
                  top: '50%',
                  x: '15%',
                  y: '-50%',
                  rotate: 15,
                  filter: 'brightness(0.85)'
                }}
                animate={{
                  y: ['-50%', '-55%', '-50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main Front Lighter */}
              <motion.img
                src={hero1}
                alt="Primary beaded lighter"
                className="relative w-40 md:w-48 lg:w-56 h-auto object-contain drop-shadow-2xl z-10"
                animate={{
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Thread Image - Desktop: Lower Right */}
              <img
                src={thread}
                alt="Traditional beadwork thread and needle"
                className="hidden md:block absolute w-1/2 h-1/2 object-contain opacity-10"
                style={{
                  right: '-10%',
                  bottom: '-20%',
                  transform: 'rotate(-5deg)'
                }}
              />

              {/* Thread Image - Mobile: Bottom Center */}
              <img
                src={thread}
                alt="Traditional beadwork thread and needle"
                className="md:hidden absolute w-1/2 h-1/2 object-contain opacity-10"
                style={{
                  left: '50%',
                  bottom: '0%',
                  transform: 'translateX(-50%) rotate(-5deg)'
                }}
              />
            </div> {/* End of aspect-square div */}
            {/* Floating Badge */}
            <div className="hidden md:block absolute bottom-4 left-1/2 bg-card p-4 rounded-lg shadow-medium animate-fade-in z-20" style={{ animationDelay: "0.5s", transform: 'translateX(-50%) translateX(50px) translateY(-80px)' }}>
              <p className="font-display text-2xl font-semibold text-primary">100%</p>
              <p className="font-body text-sm text-muted-foreground">Handmade</p>
            </div>
          </div> {/* End of relative flex-center div */}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <a
            href="#collection"
            onClick={(e) => scrollToSection(e, 'collection')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowDown className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
