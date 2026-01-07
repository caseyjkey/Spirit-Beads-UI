import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldHideButton, setShouldHideButton] = useState(false);
    const aboutSectionRef = useRef<HTMLElement | null>(null);
    const lastVisibilityState = useRef(false);

    useEffect(() => {
        // Find About section element
        const aboutSection = document.querySelector('#about') as HTMLElement;
        aboutSectionRef.current = aboutSection;

        const toggleVisibility = () => {
            if (window.pageYOffset > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Set up Intersection Observer for About section
        const aboutSectionObserver = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                const isNowVisible = entry.isIntersecting;

                // Only update state if it actually changes to prevent thrashing
                if (isNowVisible !== lastVisibilityState.current) {
                    lastVisibilityState.current = isNowVisible;
                    setShouldHideButton(isNowVisible);
                }
            },
            {
                root: null,
                rootMargin: '-30% 0px 0px 0px', // Trigger when 30% from top
                threshold: [0, 0.1, 0.5] // Multiple thresholds for better detection
            }
        );

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        if (aboutSection) {
            aboutSectionObserver.observe(aboutSection);
        }

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            if (aboutSection) {
                aboutSectionObserver.unobserve(aboutSection);
            }
            aboutSectionObserver.disconnect();
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Position button relative to the products section, not viewport
    const buttonStyle = {
        position: 'fixed' as const,
        bottom: '2rem',
        right: '2rem',
        maxWidth: 'calc(100vw - 2rem)' // Ensure button doesn't overflow on small screens
    };

    // Combined visibility state: hide when About section is visible or when not scrolled enough
    const shouldBeVisible = isVisible && !shouldHideButton;

    return (
        <motion.button
            onClick={scrollToTop}
            className="p-3 rounded-full shadow-lg transition-all duration-300 z-[60] bg-primary text-primary-foreground hover:bg-primary/90"
            style={buttonStyle}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: shouldBeVisible ? 1 : 0,
                scale: shouldBeVisible ? 1 : 0,
                transition: { duration: 0.3, ease: "easeInOut" }
            }}
            whileHover={{ scale: shouldBeVisible ? 1.1 : 1 }}
            whileTap={{ scale: shouldBeVisible ? 0.95 : 1 }}
            aria-label="Back to top"
        >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </motion.button>
    );
};

export default BackToTop;
