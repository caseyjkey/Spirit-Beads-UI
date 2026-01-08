// 1. Get the production URL from your .env (VITE_API_URL)
const PROD_URL = import.meta.env.VITE_API_URL;

const getApiUrl = () => {
  // 2. If this is a production build, ALWAYS use the .env domain
  if (import.meta.env.PROD) {
    return PROD_URL;
  }

  // 3. If in Development, detect where the user is browsing from:
  // - If hostname is 'localhost', you are on your Windows PC.
  // - If hostname is '100.x.x.x', you are on your Phone via Tailscale.
  const host = window.location.hostname;
  
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // Fallback: If on your phone, use the same IP address for the backend
  return `http://${host}:8000`;
};

const API_BASE_URL = getApiUrl();

export interface Product {
  id: number;
  name: string;
  slug: string;
  pattern: string;
  pattern_display: string;
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

  async getProducts(page: number = 1, pageSize: number = 24, lighterType?: number): Promise<{
    results: Product[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(lighterType && { lighter_type: lighterType.toString() }),
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

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories/');
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
