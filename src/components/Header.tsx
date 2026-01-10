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

    // Set flag to prevent product loading during scroll
    window.dispatchEvent(new CustomEvent('prevent-load', { detail: { prevent: true } }));

    // Wait for DOM to settle, then scroll
    setTimeout(() => {
      if (sectionId === 'collection') {
        // Scroll to the collection section (which starts right after hero)
        // Use the collection section's position minus header height for proper positioning
        const collectionSection = document.getElementById('collection');
        if (collectionSection) {
          const headerHeight = window.innerWidth >= 768 ? 116 : 100;
          const rect = collectionSection.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        const section = document.getElementById(sectionId);
        if (section) {
          const headerHeight = window.innerWidth >= 768 ? 116 : 100;
          const rect = section.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }

      // Re-enable loading after scroll completes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('prevent-load', { detail: { prevent: false } }));
      }, 1500);
    }, 300);

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
  const bannerHeight = 36;
  const navHeightMd = 80;

  // Single wrapper transform for both banner and nav
  // Returns the Y position where the wrapper should be (negative values slide up)
  const getWrapperY = () => {
    // Hidden: slide completely off screen
    if (!isNavVisible) {
      return -(bannerHeight + navHeightMd);
    }

    // Scrolling down from top: both slide up together
    if (isScrollingDownFromTop) {
      return -(bannerHeight + navHeightMd);
    }

    // Approaching top (within banner height): account for scrollY
    if (scrollY <= bannerHeight) {
      return -scrollY;
    }

    // Otherwise at viewport top
    return 0;
  };

  // Nav position: slides from 0 to 36px based on banner visibility
  const getNavY = () => {
    // Hidden
    if (!isNavVisible || isScrollingDownFromTop) {
      return -(bannerHeight + navHeightMd);
    }

    // Banner visible: nav at 36px (no offset needed from wrapper)
    // Banner hidden: nav at 0px (negative offset to slide up)
    if (isBannerVisible) {
      return 0;
    }
    return -bannerHeight;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]" style={{ height: `${bannerHeight + navHeightMd}px` }}>
      {/* Single wrapper containing both banner and nav */}
      <div
        className="relative w-full h-full"
        style={{ transform: `translateY(${getWrapperY()}px)`, transition: 'transform 300ms ease-in-out' }}
      >
        {/* Shipping Banner - fades in/out at fixed position (0-36px) */}
        <div
          className={`absolute left-0 right-0 bg-primary text-primary-foreground text-center text-sm font-body flex items-center justify-center ${isBannerVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{
            height: `${bannerHeight}px`,
            top: '0',
            transition: isScrollingDownFromTop ? 'none' : 'opacity 300ms ease-in-out',
            willChange: 'opacity'
          }}
        >
          Flat $5 USA Shipping
        </div>

        {/* Main Navigation Header - positioned below banner */}
        <header
          className="absolute left-0 right-0 bg-background border-b border-border"
          style={{
            top: `${bannerHeight}px`,
            transform: `translateY(${getNavY()}px)`,
            transition: 'transform 300ms ease-in-out'
          }}
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
