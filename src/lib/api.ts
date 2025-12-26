const API_BASE_URL = 'https://spirit-beads.keycasey.com/api';

export interface Product {
  id: number;
  name: string;
  slug: string;
  pattern: string;
  pattern_display: string;
  price: number;
  description: string;
  is_sold_out: boolean;
  is_active: boolean;
  inventory_count: number;
  weight_ounces: number;
  primary_image?: string;
  is_in_stock: boolean;
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

  async getProducts(): Promise<Product[]> {
    const response = await this.request<{results: Product[]}>('/products/');
    return response.results;
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
