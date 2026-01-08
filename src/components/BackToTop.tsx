import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isInProductGrid, setIsInProductGrid] = useState(true);
    const lastIntersectingState = useRef(true);

    useEffect(() => {
        // Find ProductGrid section element
        const collectionSection = document.querySelector('#collection') as HTMLElement;

        const toggleVisibility = () => {
            // Show button when scrolled past 400px
            setIsVisible(window.pageYOffset > 400);
        };

        // Set up Intersection Observer for collection section
        // Button should only show when user is within the ProductGrid section
        const collectionObserver = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                const isNowIntersecting = entry.isIntersecting;

                // Only update state if it actually changes to prevent thrashing
                if (isNowIntersecting !== lastIntersectingState.current) {
                    lastIntersectingState.current = isNowIntersecting;
                    setIsInProductGrid(isNowIntersecting);
                }
            },
            {
                root: null,
                rootMargin: '0px 0px -10% 0px', // Slight margin at bottom for earlier hide
                threshold: 0
            }
        );

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility(); // Initial check

        if (collectionSection) {
            collectionObserver.observe(collectionSection);
        }

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            if (collectionSection) {
                collectionObserver.unobserve(collectionSection);
            }
            collectionObserver.disconnect();
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Combined visibility: show only when scrolled enough AND within ProductGrid bounds
    const shouldBeVisible = isVisible && isInProductGrid;

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
