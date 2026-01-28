import type {
  CreateOrderRequest,
  CreateOrderResponse,
  ErrorResponse,
  OrderByIdResponse,
  OrdersResponse,
  PizzaDetailsResponse,
  PizzaTypesResponse,
} from '@simple-shop/shared';
import { API_URL } from './shared/config.ts';

export async function fetchProducts(page: number): Promise<PizzaTypesResponse> {
  const res = await fetch(`${API_URL}/products?page=${page}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to load products');
  }

  return await res.json();
}

export async function fetchProduct(id: string): Promise<PizzaDetailsResponse> {
  const res = await fetch(`${API_URL}/products/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('ProductCard not found');
  }

  return await res.json();
}

export async function fetchPizzaOfTheDay(): Promise<PizzaDetailsResponse> {
  const res = await fetch(`${API_URL}/products/pizza-of-the-day`);

  if (!res.ok) {
    throw new Error('ProductCard not found');
  }

  return await res.json();
}

export async function createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.error ?? 'Failed to create orders');
  }

  return res.json();
}

export async function fetchOrders(page: number): Promise<OrdersResponse> {
  const res = await fetch(`${API_URL}/orders?page=${page}`);

  if (!res.ok) {
    throw new Error('Failed to load products');
  }

  return await res.json();
}

export async function fetchOrder(id: string): Promise<OrderByIdResponse> {
  const res = await fetch(`${API_URL}/orders/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('ProductCard not found');
  }

  return await res.json();
}
