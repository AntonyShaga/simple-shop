import { afterEach, expect, test, vi } from 'vitest';
import { fetchOrders } from '../api.ts';
import { renderWithProviders } from './helpers/renderWithProviders.tsx';
import { cleanup, screen } from '@testing-library/react';
import OrdersPage from '../pages/OrdersPage.tsx';
import React from 'react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock('../api.ts', () => ({
  fetchOrders: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

test('renders orders data', async () => {
  const page = 1;
  vi.mocked(fetchOrders).mockResolvedValue({
    data: [
      {
        id: '1',
        status: 'CREATED',
        total_amount: 12,
        created_at: '123',
      },
    ],
    page,
    limit: 5,
    total: 50,
  });

  renderWithProviders(<OrdersPage page={page} />);

  const status = await screen.findByText('CREATED');
  expect(status).toBeTruthy();
});

test('renders empty orders list', async () => {
  const page = 1;
  vi.mocked(fetchOrders).mockResolvedValue({
    data: [],
    page,
    limit: 5,
    total: 50,
  });

  renderWithProviders(<OrdersPage page={page} />);

  expect(await screen.findByText('Orders')).toBeTruthy();
});

test('prev is disabled on first page', async () => {
  const page = 1;
  vi.mocked(fetchOrders).mockResolvedValue({
    data: [
      {
        id: '1',
        status: 'CREATED',
        total_amount: 12,
        created_at: '123',
      },
    ],
    page: 1,
    limit: 10,
    total: 1,
  });

  renderWithProviders(<OrdersPage page={page} />);

  const prev = await screen.findByText('Prev');
  expect(prev.getAttribute('aria-disabled')).toBe('true');
});

test('next is disabled when last page', async () => {
  const page = 1;
  vi.mocked(fetchOrders).mockResolvedValue({
    data: [
      {
        id: '1',
        status: 'CREATED',
        total_amount: 12,
        created_at: '123',
      },
    ],
    page: 2,
    limit: 10,
    total: 11,
  });

  renderWithProviders(<OrdersPage page={page} />);

  const next = await screen.findByText('Next');
  expect(next.getAttribute('aria-disabled')).toBeTruthy();
});

test('shows current page number', async () => {
  const page = 3;
  vi.mocked(fetchOrders).mockResolvedValue({
    data: [
      {
        id: '1',
        status: 'CREATED',
        total_amount: 12,
        created_at: '123',
      },
    ],
    page: 3,
    limit: 10,
    total: 30,
  });

  renderWithProviders(<OrdersPage page={page} />);

  expect(await screen.findByText('Page 3')).toBeTruthy();
});
