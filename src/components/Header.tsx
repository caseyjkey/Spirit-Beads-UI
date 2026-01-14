import { useState, useEffect, useCallback } from "react";
import { CartButton } from "./CartButton";
import { useCheckoutSidebar } from "@/hooks/use-checkout-sidebar";
import { CheckoutSidebar } from "@/components/CheckoutSidebar";
import { useHeaderState } from "@/hooks/use-header-state";
import { useProducts } from "@/hooks/use-api";
import clsx from "clsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { status } = useHeaderState();
  const { isOpen, openSidebar, closeSidebar } = useCheckoutSidebar();
  const { disconnectObserver, disableObserver, reconnectObserver } = useProducts();

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    // Disable infinite scroll immediately to prevent any triggers during navigation
    if (sectionId !== 'collection') {
      disconnectObserver();
      // Also disable as backup
      disableObserver();
    }

    const findAndScroll = (retryCount = 0) => {
      if (sectionId === 'collection') {
        const heroSection = document.querySelector('section[class*="bg-gradient-hero"]') as HTMLElement;
        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const heroBottom = heroRect.top + scrollTop + heroRect.height;
          window.scrollTo({ top: heroBottom, behavior: 'smooth' });
        }
        return;
      }

      // For about section, target the scroll target element for precision
      const targetId = sectionId === 'about' ? 'about-scroll-target' : sectionId;
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Re-enable infinite scroll after smooth scroll completes (1 second)
        setTimeout(() => {
          reconnectObserver();
        }, 1000);
        return;
      }

      if (retryCount < 10) {
        setTimeout(() => findAndScroll(retryCount + 1), 100);
      }
    };

    findAndScroll();
    setIsMenuOpen(false);
  }, [disconnectObserver, disableObserver, reconnectObserver]);

  useEffect(() => {
    if (isOpen && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuRendered(true);
      requestAnimationFrame(() => setIsMenuVisible(true));
      return;
    }
    setIsMenuVisible(false);
    const timeoutId = window.setTimeout(() => setIsMenuRendered(false), 250);
    return () => window.clearTimeout(timeoutId);
  }, [isMenuOpen]);

  const headerClass = {
    'header-at-top': status === 'AT_TOP',
    'header-mid-page': status === 'MID_PAGE',
    'header-hidden': status === 'HIDDEN',
  };

  return (
    <div className={clsx('header-wrapper', headerClass)}>
      <div className="banner absolute top-0 left-0 right-0 z-[1] flex h-[36px] items-center justify-center bg-primary font-body text-sm text-primary-foreground">
        Flat $5 USA Shipping
      </div>
      <header className="absolute top-[36px] left-0 right-0 border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between md:h-20">
            <a href="/" className="flex items-center gap-2">
              <span className="font-display text-xl font-semibold text-foreground md:text-2xl">
                Spirit Beads
              </span>
            </a>
            <nav className="hidden items-center gap-8 md:flex">
              <a href="#collection" onClick={(e) => scrollToSection(e, 'collection')} className="font-body text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Collection
              </a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="font-body text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Our Story
              </a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="font-body text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Contact
              </a>
            </nav>
            <div className="hidden items-center gap-4 md:flex">
              <CartButton onClick={openSidebar} />
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hamburger-toggle p-2 text-foreground transition-opacity duration-800 ${isMenuOpen ? "is-open" : ""} ${isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
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
          {isMenuRendered && (
            <nav className={`mobile-nav border-t border-border md:hidden ${isMenuVisible ? "is-open" : ""}`}>
              <div className="flex flex-col gap-4">
                <a href="#collection" className="font-body text-base font-medium text-foreground transition-colors hover:text-primary" onClick={(e) => scrollToSection(e, 'collection')}>
                  Collection
                </a>
                <a href="#about" className="font-body text-base font-medium text-foreground transition-colors hover:text-primary" onClick={(e) => scrollToSection(e, 'about')}>
                  Our Story
                </a>
                <a href="#contact" className="font-body text-base font-medium text-foreground transition-colors hover:text-primary" onClick={(e) => scrollToSection(e, 'contact')}>
                  Contact
                </a>
              </div>
            </nav>
          )}
        </div>
        <CheckoutSidebar isOpen={isOpen} onClose={closeSidebar} />
      </header>
    </div>
  );
};

export default Header;
