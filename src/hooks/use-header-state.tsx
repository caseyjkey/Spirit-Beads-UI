import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface HeaderState {
  isNavVisible: boolean;
  isBannerVisible: boolean;
  isScrollingDownFromTop: boolean;
  scrollY: number;
}

const HeaderStateContext = createContext<HeaderState>({
  isNavVisible: true,
  isBannerVisible: true,
  isScrollingDownFromTop: false,
  scrollY: 0,
});

export const useHeaderState = () => useContext(HeaderStateContext);

export const HeaderStateProvider = ({ children }: { children: ReactNode }) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isScrollingDownFromTop, setIsScrollingDownFromTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const scrollDelta = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Accumulate scroll delta for smoother detection
      scrollDelta.current += delta;

      // Update scrollY state for header positioning
      setScrollY(currentScrollY);

      // At absolute top: show everything, reset scroll down state
      if (currentScrollY <= 0) {
        setIsBannerVisible(true);
        setIsNavVisible(true);
        setIsScrollingDownFromTop(false);
        scrollDelta.current = 0;
      }
      // Approaching top from below: show banner so nav can stop at 36px
      else if (currentScrollY <= 36 && delta < 0) {
        setIsBannerVisible(true);
        setIsNavVisible(true);
        setIsScrollingDownFromTop(false);
      }
      // Scrolling down from top - set flag after small threshold
      else if (scrollDelta.current > 10 && lastScrollY.current < 10) {
        setIsScrollingDownFromTop(true);
        setIsNavVisible(false);
        // Keep banner visible so it slides up with nav as one unit
        setIsBannerVisible(true);
        scrollDelta.current = 0;
      }
      // Scrolling down - hide after small threshold
      else if (scrollDelta.current > 10) {
        setIsNavVisible(false);
        // Only hide banner if we're not in the middle of scroll-down-from-top animation
        if (!isScrollingDownFromTop) {
          setIsBannerVisible(false);
        }
        scrollDelta.current = 0;
      }
      // Scrolling up - show nav immediately, banner only at top
      else if (scrollDelta.current < -10) {
        setIsNavVisible(true);
        setIsScrollingDownFromTop(false);
        // Banner stays hidden unless at very top
        if (currentScrollY > 36) {
          setIsBannerVisible(false);
        }
        scrollDelta.current = 0;
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderStateContext.Provider
      value={{
        isNavVisible,
        isBannerVisible,
        isScrollingDownFromTop,
        scrollY,
      }}
    >
      {children}
    </HeaderStateContext.Provider>
  );
};
