import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient, Product } from '@/lib/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [activeLighterType, setActiveLighterType] = useState<number | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMoreProducts = useCallback(async (pageNum: number = 1, lighterType?: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await apiClient.getProducts(pageNum, 24, lighterType);
      
      if (pageNum === 1) {
        setProducts(response.results);
      } else {
        setProducts(prev => [...prev, ...response.results]);
      }
      
      setHasMore(response.next !== null);
      setError(null);
      
    } catch (err) {
      // Don't show error for invalid page responses (common with filtering)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      
      // Check if this is an "Invalid page" error and suppress it
      if (errorMessage.includes('Invalid page') || errorMessage.includes('404')) {
        console.log('Invalid page detected, stopping pagination');
        setHasMore(false); // Stop trying to load more pages
      } else {
        // Only show other types of errors
        setError(errorMessage);
        console.error('Error fetching products:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSkeletonCount(0); // Clear skeletons when loading completes
    }
  }, []);

  useEffect(() => {
    loadMoreProducts(1, activeLighterType);
  }, [loadMoreProducts, activeLighterType]);

  useEffect(() => {
    if (page > 1) {
      loadMoreProducts(page, activeLighterType);
    }
  }, [page, loadMoreProducts, activeLighterType]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        
        // Only load more if we have more data AND filtered results are less than expected
        // Also don't load if no products exist yet (initial load)
        if (target.isIntersecting && hasMore && !loading && !loadingMore && filteredCount < 24 && !error && products.length > 0) {
          // Show skeletons immediately when sentinel is triggered
          setSkeletonCount(3);
          setPage(prev => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: '200px', // Increased margin for earlier trigger
        threshold: 0.1
      }
    );

    observerRef.current = observer;

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore, skeletonCount, products]);

  return { 
    products, 
    loading, 
    loadingMore,
    error, 
    hasMore,
    skeletonCount,
    filteredCount,
    setFilteredCount,
    activeLighterType,
    setActiveLighterType,
    setPage,
    setProducts,
    setHasMore,
    sentinelRef,
    refetch: () => {
      setPage(1);
      setProducts([]);
      setHasMore(true);
      setSkeletonCount(0);
      loadMoreProducts(1);
    }
  };
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
