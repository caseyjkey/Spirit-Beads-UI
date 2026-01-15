import { useState, useEffect, useRef, useCallback, createContext, useContext, ReactNode } from 'react';
import { apiClient, Product, Category } from '@/lib/api';

// Minimum time (ms) to show skeleton loading state for a premium feel
const SKELETON_MIN_DISPLAY_TIME = 800;
const BATCH_SIZE = 24; // Number of products per API request
const GRID_COLUMNS = 3; // Number of columns in the grid (lg breakpoint)

// Debug logging - set to false for production
const DEBUG = false;
const log = (...args: unknown[]) => {
  if (DEBUG) {
    console.log(`[useProducts ${new Date().toISOString().slice(11, 23)}]`, ...args);
  }
};

export const useProducts = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingStartTimeRef = useRef<number>(0);
  const preventLoadRef = useRef(false);
  const initialLoadCompleteRef = useRef(false);
  const isLoadingRef = useRef(false);
  const stateRef = useRef({ hasMore: true, loading: true, loadingMore: false, error: null, productsLength: 0 });
  const isNavigatingRef = useRef(false);
  const lastScrollYRef = useRef(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false); // Controls skeleton visibility
  const [skeletonCount, setSkeletonCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [activeLighterType, setActiveLighterType] = useState<number | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<number | undefined>(undefined);
  const activeCategoryRef = useRef(activeCategory);

  // Keep ref in sync with state
  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  // Temporary placeholder - will be replaced after loadMoreProducts is defined
  let setActiveCategoryWithLog: ((category: number | undefined) => void) = useCallback((category: number | undefined) => {
    console.log('[useProducts] setActiveCategory called (before init):', category);
    setActiveCategory(category);
  }, []);

  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // State to trigger observer setup

  const disableObserver = useCallback(() => {
    preventLoadRef.current = true;
    log('🔴 Infinite scroll observer DISABLED (preventLoadRef=true)');
  }, []);

  const enableObserver = useCallback(() => {
    preventLoadRef.current = false;
    log('🟢 Infinite scroll observer ENABLED (preventLoadRef=false)');
  }, []);

  const disconnectObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      log('🔌 Infinite scroll observer DISCONNECTED');
    }
    // Also set the flag as a backup
    preventLoadRef.current = true;
    // Mark that we're navigating (programmatic scroll)
    isNavigatingRef.current = true;
    lastScrollYRef.current = window.scrollY;
    log('🧭 Navigation mode ENABLED');
  }, []);

  const reconnectObserver = useCallback(() => {
    const node = sentinelRef.current;
    if (node && initialLoadCompleteRef.current) {
      // Clean up previous observer if exists
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create and attach new observer
      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0];

          // Early exit if we're in navigation mode (user clicked a nav link)
          if (isNavigatingRef.current) {
            log(`👀 IntersectionObserver callback SKIPPED - navigation mode active`);
            return;
          }

          const { hasMore, loading, loadingMore, error, productsLength } = stateRef.current;
          const canTrigger = hasMore && !loading && !loadingMore && !error && productsLength > 0 && !isLoadingRef.current && !preventLoadRef.current && initialLoadCompleteRef.current;

          log(`👀 IntersectionObserver callback - isIntersecting: ${target.isIntersecting}, canTrigger: ${canTrigger}, scrollY: ${window.scrollY}, preventLoad: ${preventLoadRef.current}`);

          if (!canTrigger && target.isIntersecting) {
            log(`👀 Cannot trigger - hasMore: ${hasMore}, loading: ${loading}, loadingMore: ${loadingMore}, error: ${!!error}, products: ${productsLength}, isLoadingRef: ${isLoadingRef.current}, preventLoad: ${preventLoadRef.current}`);
          }

          if (target.isIntersecting && canTrigger) {
            log(`🚀 Triggering page increment from IntersectionObserver`);
            setPage(prev => {
              log(`📄 Page changing: ${prev} -> ${prev + 1}`);
              return prev + 1;
            });
          }
        },
        {
          root: null,
          rootMargin: '1000px',
          threshold: 0.1
        }
      );

      observerRef.current = observer;
      observer.observe(node);
      log('🔗 Infinite scroll observer RECONNECTED');
    }
    // Also clear the flag
    preventLoadRef.current = false;
    // Clear navigation mode
    isNavigatingRef.current = false;
    log('🧭 Navigation mode DISABLED');
  }, []);

  // Calculate skeleton count: fill remaining row + full batch
  const calculateSkeletonCount = useCallback((currentProductCount: number) => {
    const itemsInLastRow = currentProductCount % GRID_COLUMNS;
    const fillRemaining = itemsInLastRow > 0 ? GRID_COLUMNS - itemsInLastRow : 0;
    return fillRemaining + BATCH_SIZE;
  }, []);

  const loadMoreProducts = useCallback(async (pageNum: number = 1, lighterType?: number, category?: number) => {
    console.log('[useProducts] loadMoreProducts called:', { pageNum, lighterType, category, scrollY: window.scrollY, isLoadingRef: isLoadingRef.current });
    console.log('[useProducts] Current activeLighterType state:', activeLighterType);
    console.log('[useProducts] Current activeCategory state:', activeCategory);

    // Prevent concurrent loads - if we're already loading, skip this request
    // Exception: page 1 always takes priority (filter change)
    if (isLoadingRef.current && pageNum !== 1) {
      console.log('[useProducts] ⚠️ Skipping load - already loading (page)', pageNum);
      return;
    }

    // If we're starting a new page 1 load while another load is in progress, that's fine
    // The page 1 load takes priority for filter changes
    isLoadingRef.current = true;

    // Track when loading started
    loadingStartTimeRef.current = Date.now();

    try {
      if (pageNum === 1) {
        log('📥 Initial load - setting loading=true, showSkeletons=true');
        setLoading(true);
        setShowSkeletons(true);
        setSkeletonCount(BATCH_SIZE);
      } else {
        log(`📥 Loading more - setting loadingMore=true, showSkeletons=true`);
        setLoadingMore(true);
        // Show skeletons immediately with proper count
        setShowSkeletons(true);
      }

      log(`📥 Fetching products from API...`);
      const response = await apiClient.getProducts(pageNum, BATCH_SIZE, lighterType, category);
      log(`📥 API response received - ${response.results.length} products, hasMore: ${response.next !== null}`);

      // Calculate how long we've been loading
      const elapsedTime = Date.now() - loadingStartTimeRef.current;
      const remainingTime = Math.max(0, SKELETON_MIN_DISPLAY_TIME - elapsedTime);

      // Wait for minimum display time if needed
      if (remainingTime > 0) {
        log(`⏳ Waiting ${remainingTime}ms for minimum skeleton display time`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      // Add products FIRST to prevent content gap, then hide skeletons
      // AnimatePresence handles the exit animation for skeletons
      log(`✅ Adding products to state, scrollY before: ${window.scrollY}`);
      if (pageNum === 1) {
        setProducts(response.results);
      } else {
        setProducts(prev => {
          log(`✅ Products: ${prev.length} + ${response.results.length} = ${prev.length + response.results.length}`);
          return [...prev, ...response.results];
        });
      }

      // Hide standalone skeletons - ProductCards have built-in skeleton cross-fade
      log(`🔄 Hiding standalone skeletons, scrollY: ${window.scrollY}`);
      setShowSkeletons(false);

      // Mark initial load as complete to allow infinite scroll
      initialLoadCompleteRef.current = true;
      setInitialLoadComplete(true);

      setHasMore(response.next !== null);
      setError(null);

      // Now that products are added, clear loading state
      // This must happen AFTER setProducts to prevent "No Lighters Found" flash
      log(`📥 Products added, clearing loading state`);
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;

      // Log scroll position after state update (using setTimeout to get post-render value)
      setTimeout(() => {
        log(`✅ Products added, scrollY after render: ${window.scrollY}`);
      }, 50);

    } catch (err) {
      // Don't show error for invalid page responses (common with filtering)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';

      // Check if this is an "Invalid page" error and suppress it
      if (errorMessage.includes('Invalid page') || errorMessage.includes('404')) {
        log('⚠️ Invalid page detected, stopping pagination');
        setHasMore(false); // Stop trying to load more pages
      } else {
        // Only show other types of errors
        setError(errorMessage);
        console.error('Error fetching products:', err);
      }
      setShowSkeletons(false);
      // Clear loading state on error too
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, []);

  // Redefine the wrapper with proper implementation after loadMoreProducts is defined
  setActiveCategoryWithLog = useCallback((category: number | undefined) => {
    const previousCategory = activeCategoryRef.current;
    console.log('[useProducts] setActiveCategory called with:', category, 'previous value:', previousCategory);

    // If clicking the same category, do nothing (prevent unnecessary refreshes)
    if (category === previousCategory) {
      console.log('[useProducts] Same category selected, skipping refresh');
      return;
    }

    setActiveCategory(category);
  }, [activeLighterType, loadMoreProducts]);

  useEffect(() => {
    console.log('[useProducts] useEffect triggered - calling loadMoreProducts with:', { page: 1, activeLighterType, activeCategory });
    loadMoreProducts(1, activeLighterType, activeCategory);
  }, [activeLighterType, activeCategory]);

  useEffect(() => {
    if (page > 1) {
      loadMoreProducts(page, activeLighterType, activeCategory);
    }
  }, [page, activeLighterType, activeCategory]);

  // Update skeleton count when products change and we're loading more
  useEffect(() => {
    if (loadingMore || showSkeletons) {
      const newCount = calculateSkeletonCount(products.length);
      log(`🦴 Updating skeleton count: ${newCount} (products: ${products.length}, loadingMore: ${loadingMore}, showSkeletons: ${showSkeletons})`);
      setSkeletonCount(newCount);
    }
  }, [products.length, loadingMore, showSkeletons, calculateSkeletonCount]);

  // Debug: Log state changes
  useEffect(() => {
    log(`📊 State changed - showSkeletons: ${showSkeletons}, loadingMore: ${loadingMore}, skeletonCount: ${skeletonCount}`);
  }, [showSkeletons, loadingMore, skeletonCount]);

  // Update stateRef when dependencies change
  useEffect(() => {
    stateRef.current = { hasMore, loading, loadingMore, error, productsLength: products.length };
  }, [hasMore, loading, loadingMore, error, products.length]);

  // Create a callback ref that sets up observer when sentinel element is available
  const setupObserver = useCallback((node: HTMLDivElement | null) => {
    // Don't set up observer until initial load is complete
    if (!initialLoadCompleteRef.current) {
      log(`👀 Skipping observer setup - initial load not complete yet`);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      sentinelRef.current = node;
      return;
    }

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Store the node reference
    sentinelRef.current = node;

    if (!node) {
      log(`👀 Sentinel node removed`);
      return;
    }

    log(`👀 Setting up IntersectionObserver with callback ref`);

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        // Early exit if we're in navigation mode (user clicked a nav link)
        if (isNavigatingRef.current) {
          log(`👀 IntersectionObserver callback SKIPPED - navigation mode active`);
          return;
        }

        const { hasMore, loading, loadingMore, error, productsLength } = stateRef.current;
        const canTrigger = hasMore && !loading && !loadingMore && !error && productsLength > 0 && !isLoadingRef.current && !preventLoadRef.current && initialLoadCompleteRef.current;

        log(`👀 IntersectionObserver callback - isIntersecting: ${target.isIntersecting}, canTrigger: ${canTrigger}, scrollY: ${window.scrollY}, preventLoad: ${preventLoadRef.current}`);

        if (!canTrigger && target.isIntersecting) {
          log(`👀 Cannot trigger - hasMore: ${hasMore}, loading: ${loading}, loadingMore: ${loadingMore}, error: ${!!error}, products: ${productsLength}, isLoadingRef: ${isLoadingRef.current}, preventLoad: ${preventLoadRef.current}`);
        }

        // Only load more if we have more data
        // Also don't load if no products exist yet (initial load)
        if (target.isIntersecting && canTrigger) {
          log(`🚀 Triggering page increment from IntersectionObserver`);
          setPage(prev => {
            log(`📄 Page changing: ${prev} -> ${prev + 1}`);
            return prev + 1;
          });
        }
      },
      {
        root: null,
        // Trigger when second-to-last row is visible (roughly 2 rows * ~500px each = 1000px margin)
        rootMargin: '1000px',
        threshold: 0.1
      }
    );

    observerRef.current = observer;
    observer.observe(node);
    log(`👀 Observer attached to sentinel`);
  }, []);

  // Set up observer when initial load completes and sentinel is available
  useEffect(() => {
    if (initialLoadComplete && sentinelRef.current && !observerRef.current) {
      const node = sentinelRef.current;

      log(`👀 Setting up IntersectionObserver from useEffect (initialLoadComplete triggered)`);

      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0];

          // Early exit if we're in navigation mode (user clicked a nav link)
          if (isNavigatingRef.current) {
            log(`👀 IntersectionObserver callback SKIPPED - navigation mode active`);
            return;
          }

          const { hasMore, loading, loadingMore, error, productsLength } = stateRef.current;
          const canTrigger = hasMore && !loading && !loadingMore && !error && productsLength > 0 && !isLoadingRef.current && !preventLoadRef.current && initialLoadCompleteRef.current;

          log(`👀 IntersectionObserver callback - isIntersecting: ${target.isIntersecting}, canTrigger: ${canTrigger}, scrollY: ${window.scrollY}, preventLoad: ${preventLoadRef.current}`);

          if (!canTrigger && target.isIntersecting) {
            log(`👀 Cannot trigger - hasMore: ${hasMore}, loading: ${loading}, loadingMore: ${loadingMore}, error: ${!!error}, products: ${productsLength}, isLoadingRef: ${isLoadingRef.current}, preventLoad: ${preventLoadRef.current}`);
          }

          if (target.isIntersecting && canTrigger) {
            log(`🚀 Triggering page increment from IntersectionObserver`);
            setPage(prev => {
              log(`📄 Page changing: ${prev} -> ${prev + 1}`);
              return prev + 1;
            });
          }
        },
        {
          root: null,
          rootMargin: '1000px',
          threshold: 0.1
        }
      );

      observerRef.current = observer;
      observer.observe(node);
      log(`👀 Observer attached to sentinel from useEffect`);
    }
  }, [initialLoadComplete]);

  // Scroll listener to re-enable infinite scroll when user scrolls up into ProductGrid
  useEffect(() => {
    if (!initialLoadComplete) return;

    let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
    let navigationStartTime = 0;

    const handleScroll = () => {
      // Only process if we're in navigation mode (user clicked nav link)
      if (!isNavigatingRef.current || !preventLoadRef.current) return;

      // Track when navigation mode started
      if (navigationStartTime === 0) {
        navigationStartTime = Date.now();
      }

      // Ignore scroll events during first 1.2 seconds after navigation started
      // (smooth scroll animation duration)
      const timeSinceNavStart = Date.now() - navigationStartTime;
      if (timeSinceNavStart < 1200) {
        lastScrollYRef.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      // Check if we're scrolling up
      if (!isScrollingUp) return;

      // Clear any pending scroll end check
      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }

      // Debounce: wait for scroll to settle before re-enabling
      scrollEndTimeout = setTimeout(() => {
        if (!isNavigatingRef.current || !preventLoadRef.current) return;

        const productGrid = document.getElementById('collection');
        const sentinel = document.getElementById('bottom-sentinel');
        if (!productGrid || !sentinel) return;

        const gridRect = productGrid.getBoundingClientRect();
        const sentinelRect = sentinel.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if ProductGrid is substantially visible (bottom is in lower 50% of viewport or below)
        // This prevents triggering when at About/Contact where ProductGrid is fully scrolled past
        const isProductGridVisible = gridRect.bottom > viewportHeight * 0.5;

        // Check if sentinel is approaching (within 1000px, matching IntersectionObserver rootMargin)
        // This triggers when viewing the last ~2 rows of products
        const isSentinelApproaching = sentinelRect.top < viewportHeight + 1000;

        if (isProductGridVisible && isSentinelApproaching) {
          log('📍 User scrolled up to products area - re-enabling infinite scroll');
          navigationStartTime = 0; // Reset for next navigation
          reconnectObserver();
        }
      }, 150); // Wait 150ms after scroll stops
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
    };
  }, [initialLoadComplete, reconnectObserver]);

  return {
    products,
    loading,
    loadingMore,
    showSkeletons,
    error,
    hasMore,
    skeletonCount,
    filteredCount,
    setFilteredCount,
    activeLighterType,
    setActiveLighterType,
    activeCategory,
    setActiveCategory: setActiveCategoryWithLog,
    setPage,
    setProducts,
    setHasMore,
    setupObserver,
    disableObserver,
    enableObserver,
    disconnectObserver,
    reconnectObserver,
    refetch: () => {
      setPage(1);
      setProducts([]);
      setHasMore(true);
      setSkeletonCount(0);
      setShowSkeletons(false);
      loadMoreProducts(1);
    }
  };
};

// Products Context for sharing state across components
type ProductsContextValue = ReturnType<typeof useProductsInternal>;

const ProductsContext = createContext<ProductsContextValue | null>(null);

// Rename the internal hook
const useProductsInternal = useProducts;

// Provider component
export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const value = useProductsInternal();
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// Hook to consume the context - this is what components should use
export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getCategories();
        // Extract the results array from paginated response
        const categoriesArray = data.results || data;
        setCategories(categoriesArray);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useProduct = (slug: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProduct(slug);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, loading, error };
};
