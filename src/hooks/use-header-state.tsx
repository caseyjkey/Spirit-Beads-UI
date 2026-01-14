import { createContext, useContext, useState, useLayoutEffect, useRef, ReactNode } from 'react';

export type HeaderStatus = 'AT_TOP' | 'MID_PAGE' | 'HIDDEN';

interface HeaderState {
  status: HeaderStatus;
}

const HeaderStateContext = createContext<HeaderState>({
  status: 'AT_TOP',
});

export const useHeaderState = () => useContext(HeaderStateContext);

export const HeaderStateProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initialization: read scroll position immediately during render
  const getInitialState = (): HeaderStatus => {
    const initialScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    return initialScrollY > 10 ? 'MID_PAGE' : 'AT_TOP';
  };

  const [status, setStatus] = useState<HeaderStatus>(getInitialState);
  const lastScrollY = useRef(0);

  useLayoutEffect(() => {
    // Set initial lastScrollY based on current position
    const initialScrollY = window.scrollY;
    lastScrollY.current = initialScrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < 5) return;

      const isScrollingDown = delta > 0;

      if (currentScrollY <= 10) {
        setStatus('AT_TOP');
      } else if (isScrollingDown) {
        setStatus('HIDDEN');
      } else {
        setStatus('MID_PAGE');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderStateContext.Provider value={{ status }}>
      {children}
    </HeaderStateContext.Provider>
  );
};
