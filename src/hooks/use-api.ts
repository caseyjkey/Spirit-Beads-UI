import { useState, useEffect, useRef, useCallback } from 'react';
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingStartTimeRef = useRef<number>(0);

  // Calculate skeleton count: fill remaining row + full batch
  const calculateSkeletonCount = useCallback((currentProductCount: number) => {
    const itemsInLastRow = currentProductCount % GRID_COLUMNS;
    const fillRemaining = itemsInLastRow > 0 ? GRID_COLUMNS - itemsInLastRow : 0;
    return fillRemaining + BATCH_SIZE;
  }, []);

  // Ref to track if we're currently loading to prevent race conditions
  const isLoadingRef = useRef(false);

  const loadMoreProducts = useCallback(async (pageNum: number = 1, lighterType?: number, category?: number) => {
    log(`📥 loadMoreProducts called - page: ${pageNum}, lighterType: ${lighterType}, category: ${category}, scrollY: ${window.scrollY}, isLoadingRef: ${isLoadingRef.current}`);

    // Prevent concurrent loads - if we're already loading, skip this request
    // Exception: page 1 always takes priority (filter change)
    if (isLoadingRef.current && pageNum !== 1) {
      log(`⚠️ Skipping load - already loading (page ${pageNum})`);
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

      setHasMore(response.next !== null);
      setError(null);

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
    } finally {
      log(`📥 loadMoreProducts complete - setting loading=false, loadingMore=false`);
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadMoreProducts(1, activeLighterType, activeCategory);
  }, [loadMoreProducts, activeLighterType, activeCategory]);

  useEffect(() => {
    if (page > 1) {
      loadMoreProducts(page, activeLighterType, activeCategory);
    }
  }, [page, loadMoreProducts, activeLighterType, activeCategory]);

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

  // Use refs to track current state values for the IntersectionObserver callback
  // This prevents stale closures and unnecessary observer recreations
  const stateRef = useRef({ hasMore, loading, loadingMore, error, productsLength: products.length });
  useEffect(() => {
    stateRef.current = { hasMore, loading, loadingMore, error, productsLength: products.length };
  }, [hasMore, loading, loadingMore, error, products.length]);

  // Create a callback ref that sets up the observer when the sentinel element is available
  const setupObserver = useCallback((node: HTMLDivElement | null) => {
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
        const { hasMore, loading, loadingMore, error, productsLength } = stateRef.current;
        const canTrigger = hasMore && !loading && !loadingMore && !error && productsLength > 0 && !isLoadingRef.current;

        log(`👀 IntersectionObserver callback - isIntersecting: ${target.isIntersecting}, canTrigger: ${canTrigger}, scrollY: ${window.scrollY}`);

        if (!canTrigger && target.isIntersecting) {
          log(`👀 Cannot trigger - hasMore: ${hasMore}, loading: ${loading}, loadingMore: ${loadingMore}, error: ${!!error}, products: ${productsLength}, isLoadingRef: ${isLoadingRef.current}`);
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
    setActiveCategory,
    setPage,
    setProducts,
    setHasMore,
    setupObserver,
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
