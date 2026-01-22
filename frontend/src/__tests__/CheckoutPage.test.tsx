import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { renderWithProviders } from './helpers/renderWithProviders.tsx';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import CheckoutPage from '../pages/CheckoutPage.tsx';
import type { CartItem } from '../entities/cart';
import { createOrder } from '../api.ts';

afterEach(() => {
  cleanup();
});

let cartMock: {
  cart: CartItem[];
  setCart: ReturnType<typeof vi.fn>;
} = {
  cart: [],
  setCart: vi.fn(),
};

vi.mock('../entities/cart', () => ({
  useCart: () => cartMock,
}));

beforeEach(() => {
  cartMock = {
    cart: [],
    setCart: vi.fn(),
  };
});

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../api.ts', () => ({
  createOrder: vi.fn(),
}));

test('renders checkout page', () => {
  renderWithProviders(<CheckoutPage />);

  expect(screen.getByRole('heading', { name: /checkout/i })).toBeTruthy();
});

test('shows message when no items selected', () => {
  cartMock = {
    cart: [],
    setCart: vi.fn(),
  };

  renderWithProviders(<CheckoutPage />);

  expect(screen.getByText(/no items selected/i)).toBeTruthy();
});

test('renders selected items', () => {
  cartMock = {
    cart: [
      {
        pizza_type_id: '1',
        pizza_id: '2',
        name: 'Pepperoni',
        size: 'M',
        price: 12,
        quantity: 2,
        selected: true,
        image_url: '/pepperoni.png',
      },
    ],
    setCart: vi.fn(),
  };

  renderWithProviders(<CheckoutPage />);

  expect(screen.getByText('Pepperoni')).toBeTruthy();
  expect(screen.getByText('M')).toBeTruthy();
  expect(screen.getByText('2')).toBeTruthy();

  const img = screen.getByRole('img', { name: /pepperoni/i });
  expect(img.getAttribute('src')).toContain('pepperoni.png');
});

test('submits order and navigates back to cart', async () => {
  const setCartMock = vi.fn();

  cartMock = {
    cart: [
      {
        pizza_type_id: '1',
        pizza_id: '2',
        name: 'Pepperoni',
        size: 'M',
        price: 12,
        quantity: 2,
        selected: true,
        image_url: '/pepperoni.png',
      },
    ],
    setCart: setCartMock,
  };

  vi.mocked(createOrder).mockResolvedValue({
    ok: true,
    orderId: 'order-123',
    total: 24,
  });

  renderWithProviders(<CheckoutPage />);

  fireEvent.click(screen.getByRole('button', { name: /confirm order/i }));

  await waitFor(() => {
    expect(createOrder).toHaveBeenCalled();
    expect(setCartMock).toHaveBeenCalled();
  });
});

test('shows error when order creation fails', async () => {
  cartMock = {
    cart: [
      {
        pizza_type_id: '1',
        pizza_id: '2',
        name: 'Pepperoni',
        size: 'M',
        price: 12,
        quantity: 2,
        selected: true,
        image_url: '/pepperoni.png',
      },
    ],
    setCart: vi.fn(),
  };

  vi.mocked(createOrder).mockRejectedValue(new Error('fail'));

  window.alert = vi.fn();

  renderWithProviders(<CheckoutPage />);

  fireEvent.click(screen.getByRole('button', { name: /confirm order/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Order failed');
  });
});
