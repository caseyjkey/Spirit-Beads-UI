import { useState, useEffect } from "react";
import { CartButton } from "./CartButton";
import { useCheckoutSidebar } from "@/hooks/use-checkout-sidebar";
import { CheckoutSidebar } from "@/components/CheckoutSidebar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isOpen, openSidebar, closeSidebar } = useCheckoutSidebar();

  // Close hamburger menu when cart opens
  useEffect(() => {
    if (isOpen && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMenuVisible(true);
        });
      });
      return;
    }

    setIsMenuVisible(false);
    const timeoutId = window.setTimeout(() => {
      setIsMenuRendered(false);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="font-display text-xl md:text-2xl font-semibold text-foreground">
              Sacred Beads
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#collection"
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Collection
            </a>
            <a
              href="#about"
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Our Story
            </a>
            <a
              href="#contact"
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <CartButton onClick={openSidebar} />
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`hamburger-toggle p-2 text-foreground${isMenuOpen ? " is-open" : ""} transition-opacity duration-800 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <span className="hamburger" aria-hidden="true">
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
              </span>
            </button>
            <CartButton onClick={openSidebar} />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuRendered && (
          <nav className={`mobile-nav md:hidden border-t border-border${isMenuVisible ? " is-open" : ""}`}>
            <div className="flex flex-col gap-4">
              <a
                href="#collection"
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Collection
              </a>
              <a
                href="#about"
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Story
              </a>
              <a
                href="#contact"
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </nav>
        )}
      </div>

      <CheckoutSidebar isOpen={isOpen} onClose={closeSidebar} />
    </header>
  );
};

export default Header;
