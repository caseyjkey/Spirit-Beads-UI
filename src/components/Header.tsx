import { useState, useEffect, useCallback } from "react";
import { CartButton } from "./CartButton";
import { useCheckoutSidebar } from "@/hooks/use-checkout-sidebar";
import { CheckoutSidebar } from "@/components/CheckoutSidebar";
import { useHeaderState } from "@/hooks/use-header-state";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isNavVisible, isBannerVisible, isScrollingDownFromTop, scrollY } = useHeaderState();
  const { isOpen, openSidebar, closeSidebar } = useCheckoutSidebar();

  // Smooth scroll to section with no offset (section fills viewport)
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  }, []);

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

  // Heights
  const bannerHeight = 36; // py-2 + text = ~36px
  const navHeight = 64; // mobile
  const navHeightMd = 80; // desktop

  // Nav wrapper transform - slides nav, accounts for scroll position
  // Nav should stop at 36px from viewport top when approaching top
  const getNavWrapperTransform = () => {
    if (!isNavVisible || isScrollingDownFromTop) {
      // Hidden: slide nav completely off screen
      return `translateY(-${bannerHeight + navHeightMd}px)`;
    }

    // When approaching top (within banner height), stop at 36px from viewport top
    if (scrollY <= bannerHeight) {
      return `translateY(-${scrollY}px)`;
    }

    // Otherwise, nav wrapper is at viewport top
    return 'translateY(0)';
  };

  // Nav transform - slides within wrapper based on banner visibility
  const getNavTransform = () => {
    // When nav hidden, slide off screen
    if (!isNavVisible || isScrollingDownFromTop) {
      return `translateY(-${bannerHeight + navHeightMd}px)`;
    }

    // Banner hidden: nav slides up to top of wrapper
    if (!isBannerVisible) {
      return `translateY(-${bannerHeight}px)`;
    }

    // Banner visible: nav stays below banner
    return 'translateY(0)';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]" style={{ height: `${bannerHeight + navHeightMd}px` }}>
      {/* Shipping Banner - separate from wrapper, fades in/out at fixed position */}
      <div
        className={`absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-sm font-body flex items-center justify-center transition-opacity duration-300 ease-in-out ${isBannerVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ height: `${bannerHeight}px` }}
      >
        Flat $5 USA Shipping
      </div>

      {/* Nav wrapper - slides independently of banner */}
      <div
        className="relative w-full transition-transform duration-300 ease-in-out"
        style={{ transform: getNavWrapperTransform(), height: `${bannerHeight + navHeightMd}px`, top: `${bannerHeight}px` }}
      >
        {/* Main Navigation Header */}
        <header
          className="absolute left-0 right-0 bg-background border-b border-border transition-transform duration-300 ease-in-out"
          style={{ top: '0', transform: getNavTransform() }}
        >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="font-display text-xl md:text-2xl font-semibold text-foreground">
                Spirit Beads
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#collection"
                onClick={(e) => scrollToSection(e, 'collection')}
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Collection
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, 'about')}
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Our Story
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
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
                  onClick={(e) => scrollToSection(e, 'collection')}
                >
                  Collection
                </a>
                <a
                  href="#about"
                  className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                  onClick={(e) => scrollToSection(e, 'about')}
                >
                  Our Story
                </a>
                <a
                  href="#contact"
                  className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                  onClick={(e) => scrollToSection(e, 'contact')}
                >
                  Contact
                </a>
              </div>
            </nav>
          )}
        </div>

        <CheckoutSidebar isOpen={isOpen} onClose={closeSidebar} />
      </header>
      </div>
    </div>
  );
};

export default Header;
