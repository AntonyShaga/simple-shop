import { expect, test, vi, afterEach } from 'vitest';
import { fetchProducts } from '../api.ts';
import { screen, cleanup } from '@testing-library/react';
import ProductsPage from '../pages/ProductsPage.tsx';
import { renderWithProviders } from './helpers/renderWithProviders.tsx';
import React from 'react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock('../api.ts', () => ({
  fetchProducts: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

test('renders products data', async () => {
  const page = 1;
  vi.mocked(fetchProducts).mockResolvedValue({
    data: [
      {
        pizza_type_id: '1',
        name: 'Pepperoni',
        category: '12',
        ingredients: '123',
        image: '/pepperoni.png',
      },
    ],
    page,
    limit: 5,
    total: 50,
  });

  renderWithProviders(<ProductsPage page={page} />);

  const title = await screen.findByText('Pepperoni');
  expect(title).toBeTruthy();

  const img = screen.getByRole('img') as HTMLImageElement;
  expect(img.getAttribute('alt')).toBe('Pepperoni');
});

test('renders empty products list', async () => {
  const page = 1;
  vi.mocked(fetchProducts).mockResolvedValue({
    data: [],
    page,
    limit: 10,
    total: 0,
  });

  renderWithProviders(<ProductsPage page={page} />);

  expect(await screen.findByText('Products')).toBeTruthy();
  expect(screen.queryByRole('img')).toBeNull();
});

test('prev is disabled on first page', async () => {
  const page = 1;
  vi.mocked(fetchProducts).mockResolvedValue({
    data: [{ pizza_type_id: '1', name: 'Pepperoni', category: '123', ingredients: '123', image: '/pep.png' }],
    page: 1,
    limit: 10,
    total: 1,
  });

  renderWithProviders(<ProductsPage page={page} />);

  const prev = await screen.findByText('Prev');
  expect(prev.getAttribute('aria-disabled')).toBe('true');
});

test('next is disabled when last page', async () => {
  const page = 1;
  vi.mocked(fetchProducts).mockResolvedValue({
    data: [{ pizza_type_id: '1', name: 'Pepperoni', category: '123', ingredients: '123', image: '/pep.png' }],
    page: 2,
    limit: 10,
    total: 11,
  });

  renderWithProviders(<ProductsPage page={page} />);

  const next = await screen.findByText('Next');
  expect(next.getAttribute('aria-disabled')).toBeTruthy();
});

test('shows current page number', async () => {
  const page = 3;
  vi.mocked(fetchProducts).mockResolvedValue({
    data: [{ pizza_type_id: '1', name: 'Pepperoni', category: '123', ingredients: '123', image: '/pep.png' }],
    page: 3,
    limit: 10,
    total: 30,
  });

  renderWithProviders(<ProductsPage page={page} />);

  expect(await screen.findByText('Page 3')).toBeTruthy();
});
