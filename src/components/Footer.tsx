import { Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-deep-brown text-cream py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-semibold mb-4">Spirit Beads</h3>
            <p className="font-body text-cream/80 max-w-md mb-6">
              Handcrafted beaded lighter cases made with love and traditional
              Native American techniques. Each piece is unique and carries
              the spirit of its maker.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@sacredbeads.com"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body">
              <li>
                <a href="#collection" className="text-cream/80 hover:text-cream transition-colors">
                  Shop Collection
                </a>
              </li>
              <li>
                <a href="#about" className="text-cream/80 hover:text-cream transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                  Custom Orders
                </a>
              </li>
              <li>
                <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                  Care Instructions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Get in Touch</h4>
            <ul className="space-y-3 font-body text-cream/80">
              <li>lynnbraveheart07@gmail.com</li>
              <li>Custom orders welcome</li>
              <li>Ships from the Midwest</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-sm text-cream/60">
              © {new Date().getFullYear()} Spirit Beads. All rights reserved.
            </p>
            <p className="font-body text-sm text-cream/60">
              Made with ❤️ on Native Land
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
