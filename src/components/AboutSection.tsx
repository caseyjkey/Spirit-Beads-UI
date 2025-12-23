import { Heart, Sparkles, Users } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every bead is placed by hand with intention and care, honoring traditions passed down through generations.",
  },
  {
    icon: Sparkles,
    title: "One of a Kind",
    description: "Each lighter case features a unique pattern. Your piece will never be replicated exactly.",
  },
  {
    icon: Users,
    title: "Supporting Community",
    description: "Your purchase directly supports a Native American artisan and helps preserve traditional crafts.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Story Content */}
          <div>
            <span className="font-body text-sm uppercase tracking-widest text-accent mb-4 block">
              Our Story
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
              Preserving Heritage,
              <br />
              <span className="text-primary">One Bead at a Time</span>
            </h2>
            
            <div className="space-y-4 font-body text-muted-foreground">
              <p>
                Sacred Beads was born from a deep passion for traditional Native American 
                beadwork and a desire to share this beautiful art form with the world.
              </p>
              <p>
                Each lighter case is meticulously handcrafted using techniques that have 
                been passed down through generations. The patterns you see are inspired 
                by the natural world—mountains, rivers, eagles, and the sacred geometry 
                that connects all living things.
              </p>
              <p>
                When you purchase from Sacred Beads, you're not just buying a product. 
                You're supporting Indigenous artistry, helping preserve cultural traditions, 
                and carrying a piece of handmade history with you.
              </p>
            </div>

            <div className="mt-8 p-6 bg-card rounded-lg shadow-soft">
              <p className="font-display text-lg italic text-foreground">
                "Every bead tells a story. I hope when you hold my work, 
                you feel the love and tradition woven into each piece."
              </p>
              <p className="font-body text-sm text-muted-foreground mt-3">
                — The Artist
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex gap-4 p-6 bg-card rounded-lg shadow-soft hover:shadow-medium transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Native Owned Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-primary-foreground">N</span>
              </div>
              <div>
                <p className="font-display text-lg font-medium text-foreground">
                  Proudly Native Owned
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Supporting Indigenous Communities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
