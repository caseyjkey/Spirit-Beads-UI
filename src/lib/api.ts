// Production API URL
const PROD_API_URL = 'https://spirit-beads.keycasey.com/api';

/**
 * Determines the API base URL based on environment:
 * - Production build: Uses production URL
 * - Development on localhost: Uses localhost:8000
 * - Development on Tailscale IP (100.82.23.47): Uses same IP with port 8000
 */
export const getApiBaseUrl = (): string => {
  
  // Production build always uses the production URL
  if (import.meta.env.PROD) {
    return PROD_API_URL;
  }

  // Development: detect where the user is browsing from
  const host = window.location.hostname;

  // Localhost/127.0.0.1 → local backend
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }

  // Tailscale IP or any other IP → use same IP with port 8000
  if (host === '100.82.23.47') {
    return 'http://100.82.23.47:8000/api';
  }

  // Fallback: use same protocol as current page with port 8000
  const protocol = window.location.protocol;
  return `${protocol}//${host}:8000/api`;
};

/**
 * Returns the media base URL (without /api suffix) for image URLs
 */
export const getMediaBaseUrl = (): string => {
  const apiUrl = getApiBaseUrl();
  return apiUrl.replace('/api', '');
};

const API_BASE_URL = getApiBaseUrl();

export interface Product {
  id: number;
  name: string;
  slug: string;
  lighter_type: string;
  lighter_type_display: string;
  price: number;
  description: string;
  is_sold_out: boolean;
  is_active: boolean;
  inventory_count: number;
  weight_ounces: number;
  primary_image?: string;
  is_in_stock: boolean;
  category?: string;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getProducts(page: number = 1, pageSize: number = 24, lighterType?: number, category?: number): Promise<{
    results: Product[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(lighterType && { lighter_type: lighterType.toString() }),
      ...(category && { category: category.toString() }),
    });
    return this.request(`/products/?${params}`);
  }

  async getBatchProducts(ids: string[]): Promise<{
    products: Product[];
    count: number;
  }> {
    const params = new URLSearchParams({
      ids: ids.join(','),
    });
    return this.request(`/products/batch/?${params}`);
  }

  async getProduct(slug: string): Promise<Product> {
    return this.request<Product>(`/products/${slug}/`);
  }

  async getCategories(): Promise<{
    results: Category[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    return this.request<{
      results: Category[];
      count: number;
      next: string | null;
      previous: string | null;
    }>('/categories/');
  }

  async checkProductAvailability(id: number): Promise<{
    is_in_stock: boolean;
    inventory_count: number;
    is_sold_out: boolean;
  }> {
    return this.request(`/products/${id}/check_availability/`);
  }
}

export const apiClient = new ApiClient();
