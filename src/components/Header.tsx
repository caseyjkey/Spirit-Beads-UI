import { useState, useEffect, useCallback, useRef } from "react";
import { CartButton } from "./CartButton";
import { useCheckoutSidebar } from "@/hooks/use-checkout-sidebar";
import { CheckoutSidebar } from "@/components/CheckoutSidebar";
import { useHeaderState } from "@/hooks/use-header-state";
import { useProductsContext } from "@/hooks/use-api";
import clsx from "clsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { status } = useHeaderState();
  const { isOpen, openSidebar, closeSidebar } = useCheckoutSidebar();
  const { disconnectObserver, disableObserver, loadingMore } = useProductsContext();
  const scrollingToRef = useRef<string | null>(null);

  const toggleSidebar = () => {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    // Track which section we're scrolling to (allows cancellation if user clicks different nav)
    scrollingToRef.current = sectionId;

    // Disable infinite scroll immediately to prevent any triggers during navigation
    if (sectionId !== 'collection') {
      disconnectObserver();
      // Also disable as backup
      disableObserver();
    }

    const performScroll = () => {
      // Calculate header height based on current state
      const headerHeight = status === 'AT_TOP' ? 116 : 80;

      if (sectionId === 'collection') {
        const heroSection = document.querySelector('section[class*="bg-gradient-hero"]') as HTMLElement;
        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const heroBottom = heroRect.top + scrollTop + heroRect.height;
          window.scrollTo({ top: heroBottom, behavior: 'smooth' });
        }
        scrollingToRef.current = null;
        return;
      }

      // For about and contact, use scroll-and-verify approach
      const target = document.getElementById(sectionId);

      if (!target) {
        // Element not found, retry
        setTimeout(() => {
          if (scrollingToRef.current === sectionId) {
            performScroll();
          }
        }, 100);
        return;
      }

      const scrollToTarget = (attemptCount = 0) => {
        // Abort if user clicked a different nav item
        if (scrollingToRef.current !== sectionId) return;

        // Max 5 attempts to prevent infinite loop
        if (attemptCount > 5) {
          scrollingToRef.current = null;
          return;
        }

        const rect = target.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - headerHeight;

        // Check if we're already at the target (within 5px tolerance)
        const currentOffset = Math.abs(rect.top - headerHeight);
        if (currentOffset < 5) {
          scrollingToRef.current = null;
          return; // We've arrived
        }

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        // Verify we reach target after scroll animation completes
        // If page height changed during scroll (products loaded), scroll again
        setTimeout(() => {
          if (scrollingToRef.current !== sectionId) return;

          const newRect = target.getBoundingClientRect();
          const newOffset = Math.abs(newRect.top - headerHeight);

          // If still not at target (page height likely changed), scroll again
          if (newOffset > 20) {
            scrollToTarget(attemptCount + 1);
          } else {
            scrollingToRef.current = null;
          }
        }, 600); // Check after smooth scroll settles (~500-600ms)
      };

      scrollToTarget();
    };

    // Wait for loading to complete before scrolling
    // This prevents scrolling to a position that will change when products load
    const waitForLoadingAndScroll = (waitCount = 0) => {
      // Max 30 waits (3 seconds) to prevent infinite waiting
      if (waitCount > 30) {
        performScroll();
        return;
      }

      if (loadingMore) {
        setTimeout(() => waitForLoadingAndScroll(waitCount + 1), 100);
      } else {
        performScroll();
      }
    };

    waitForLoadingAndScroll();
    setIsMenuOpen(false);
  }, [disconnectObserver, disableObserver, status, loadingMore]);

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
    <>
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
                <CartButton onClick={toggleSidebar} />
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`hamburger-toggle flex items-center justify-center text-foreground transition-opacity duration-800 ${isMenuOpen ? "is-open" : ""} ${isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
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
              <nav className={`mobile-nav border-t border-border md:hidden ${isMenuVisible ? " is-open" : ""}`}>
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
        </header>
      </div>
      <div className="fixed inset-0 pointer-events-none z-[199]">
        <div className="pointer-events-auto">
          <CheckoutSidebar isOpen={isOpen} onClose={closeSidebar} />
        </div>
      </div>
    </>
  );
};

export default Header;
