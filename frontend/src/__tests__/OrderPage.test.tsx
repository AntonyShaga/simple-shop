import { afterEach, expect, test, vi } from 'vitest';
import { fetchOrder } from '../api.ts';
import { renderWithProviders } from './helpers/renderWithProviders.tsx';
import { cleanup, screen } from '@testing-library/react';
import OrderPage from '../pages/OrderPage.tsx';

afterEach(() => {
  cleanup();
});
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('../api.ts', () => ({
  fetchOrder: vi.fn(),
}));

test('renders order data', async () => {
  vi.mocked(fetchOrder).mockResolvedValue({
    id: '1',
    status: 'CREATED',
    created_at: 'Pizza',
    total_amount: 12,
    items: [
      { pizza_id: 's', size: 'S', price: 10, image: '/pepperoni.png', quantity: 2, name: 'Pepperoni' },
      { pizza_id: 'm', size: 'M', price: 12, image: '/Hawaii.png', quantity: 2, name: 'Hawaii' },
    ],
  });

  renderWithProviders(<OrderPage />);

  const name = await screen.findByText('Pepperoni');
  expect(name).toBeTruthy();

  const status = screen.getByText('CREATED');
  expect(status).toBeTruthy();

  const imgs = await screen.findAllByRole('img');
  expect(imgs).toHaveLength(2);

  expect(imgs[0].getAttribute('alt')).toBe('Pizza Pepperoni');
  expect(imgs[1].getAttribute('alt')).toBe('Pizza Hawaii');
});

test('shows loading state', async () => {
  vi.mocked(fetchOrder).mockImplementation(() => new Promise(() => {}));

  renderWithProviders(<OrderPage />);

  expect(screen.getByText('Loading...')).toBeTruthy();
});

test('shows not found when product is missing', async () => {
  vi.mocked(fetchOrder).mockResolvedValue(null);

  renderWithProviders(<OrderPage />);

  expect(await screen.findByText('Not found')).toBeTruthy();
});

test('shows error state', async () => {
  vi.mocked(fetchOrder).mockRejectedValue(new Error('Boom'));

  renderWithProviders(<OrderPage />);

  expect(await screen.findByText(/Error:/)).toBeTruthy();
});
