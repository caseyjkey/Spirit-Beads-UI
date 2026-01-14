import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAboveFooter, setIsAboveFooter] = useState(true);
    const lastFooterState = useRef(true);

    useEffect(() => {
        // Button is 48px tall (p-3 = 12px padding * 2 + 24px icon), positioned bottom-8 (32px)
        // We want to hide when footer would overlap with button position
        const BUTTON_BOTTOM_OFFSET = 32; // bottom-8
        const BUTTON_HEIGHT = 48;
        const FADE_BUFFER = 20; // Start fading a bit before reaching the footer

        const handleScroll = () => {
            // Show button when scrolled past 400px
            setIsVisible(window.pageYOffset > 400);

            // Check if footer is approaching the button position
            const footer = document.getElementById('contact');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // Button visual bottom position from viewport bottom
                const buttonBottomFromViewportBottom = BUTTON_BOTTOM_OFFSET;
                // Footer top position from viewport bottom
                const footerTopFromViewportBottom = viewportHeight - footerRect.top;

                // Hide button when footer gets close to button position
                const shouldBeAboveFooter = footerTopFromViewportBottom < (buttonBottomFromViewportBottom + BUTTON_HEIGHT + FADE_BUFFER);

                // Only update state if it actually changes to prevent thrashing
                if (shouldBeAboveFooter !== lastFooterState.current) {
                    lastFooterState.current = shouldBeAboveFooter;
                    setIsAboveFooter(shouldBeAboveFooter);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Show when scrolled enough AND button is above the footer
    const shouldBeVisible = isVisible && isAboveFooter;

    return (
        <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg z-[60] bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ pointerEvents: shouldBeVisible ? 'auto' : 'none' }}
            initial={{ opacity: 0 }}
            animate={{
                opacity: shouldBeVisible ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
