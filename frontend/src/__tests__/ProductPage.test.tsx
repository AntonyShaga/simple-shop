import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import ProductPage from '../pages/ProductPage.tsx';
import { fetchProduct } from '../api';
import { type PropsWithChildren } from 'react';
import { renderWithProviders } from './helpers/renderWithProviders.tsx';
import { ROUTES } from '../shared/routes.ts';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.mocked(fetchProduct).mockReset();
  searchMock = {};
});

const productMock = {
  pizza_type_id: '1',
  name: 'Pepperoni',
  category: 'Pizza',
  ingredients: 'Cheese, Pepperoni',
  image: '/pepperoni.png',
  items: [
    { pizza_id: 's', size: 'S', price: 10 },
    { pizza_id: 'm', size: 'M', price: 12 },
  ],
};

const addToCartMock = vi.fn();

vi.mock('../entities/cart/useAddToCart', () => ({
  useAddToCart: () => addToCartMock,
}));

vi.mock('../api.ts', () => ({
  fetchProduct: vi.fn(),
}));

const navigateMock = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => navigateMock,
  Link: ({ children }: PropsWithChildren) => <a>{children}</a>,
}));

let searchMock: { mode?: 'edit'; cartItemId?: string } = {};

vi.mock('../routes/products/$id.lazy.tsx', () => ({
  Route: {
    useSearch: () => searchMock,
  },
}));

test('renders product data', async () => {
  vi.mocked(fetchProduct).mockResolvedValue({
    pizza_type_id: '1',
    name: 'Pepperoni',
    category: 'Pizza',
    ingredients: 'Cheese, Pepperoni',
    image: '/pepperoni.png',
    items: [
      { pizza_id: 's', size: 'S', price: 10 },
      { pizza_id: 'm', size: 'M', price: 12 },
    ],
  });

  renderWithProviders(<ProductPage />);

  const title = await screen.findByText('Pepperoni');
  expect(title).toBeTruthy();

  const category = screen.getByText('Pizza');
  expect(category).toBeTruthy();

  const img = screen.getByRole('img') as HTMLImageElement;
  expect(img.getAttribute('alt')).toBe('Pizza Pepperoni');
});

test('shows loading state', async () => {
  vi.mocked(fetchProduct).mockImplementation(() => new Promise(() => {}));

  renderWithProviders(<ProductPage />);

  expect(screen.getByText('Loading...')).toBeTruthy();
});

test('shows not found when product is missing', async () => {
  vi.mocked(fetchProduct).mockResolvedValue(null);

  renderWithProviders(<ProductPage />);

  expect(await screen.findByText('Not found')).toBeTruthy();
});

test('selects M size by default when available', async () => {
  vi.mocked(fetchProduct).mockResolvedValue({
    pizza_type_id: '1',
    name: 'Pepperoni',
    category: 'Pizza',
    ingredients: 'Cheese',
    image: '/pepperoni.png',
    items: [
      { pizza_id: 's', size: 'S', price: 10 },
      { pizza_id: 'm', size: 'M', price: 12 },
    ],
  });

  renderWithProviders(<ProductPage />);

  const button = await screen.findByText(/M — \$12/);

  expect(button.getAttribute('aria-pressed')).toBe('true');
});

test('selects first size when M is not available', async () => {
  vi.mocked(fetchProduct).mockResolvedValue({
    pizza_type_id: '1',
    name: 'Pepperoni',
    category: 'Pizza',
    ingredients: 'Cheese',
    image: '/pepperoni.png',
    items: [{ pizza_id: 's', size: 'S', price: 10 }],
  });

  renderWithProviders(<ProductPage />);

  const button = await screen.findByText('S — $10');
  expect(button.getAttribute('aria-pressed')).toBe('true');
});

test('changes selected size on click', async () => {
  vi.mocked(fetchProduct).mockResolvedValue({
    pizza_type_id: '1',
    name: 'Pepperoni',
    category: 'Pizza',
    ingredients: 'Cheese, Pepperoni',
    image: '/pepperoni.png',
    items: [
      { pizza_id: 's', size: 'S', price: 10 },
      { pizza_id: 'm', size: 'M', price: 12 },
    ],
  });

  renderWithProviders(<ProductPage />);

  const mInitial = await screen.findByText('M — $12');
  expect(mInitial.getAttribute('aria-pressed')).toBe('true');

  fireEvent.click(await screen.findByText('S — $10'));

  await waitFor(() => {
    const sAfter = screen.getByText('S — $10');
    const mAfter = screen.getByText('M — $12');

    expect(sAfter.getAttribute('aria-pressed')).toBe('true');
    expect(mAfter.getAttribute('aria-pressed')).toBe('false');
  });
});

test('adds product to cart and navigates to products', async () => {
  searchMock = {};

  vi.mocked(fetchProduct).mockResolvedValue({
    pizza_type_id: '1',
    name: 'Pepperoni',
    category: 'Pizza',
    ingredients: 'Cheese, Pepperoni',
    image: '/pepperoni.png',
    items: [
      { pizza_id: 's', size: 'S', price: 10 },
      { pizza_id: 'm', size: 'M', price: 12 },
    ],
  });

  renderWithProviders(<ProductPage />);

  const addButton = await screen.findByRole('button', {
    name: /add pizza pepperoni to cart/i,
  });

  fireEvent.click(addButton);

  expect(addToCartMock).toHaveBeenCalledWith(productMock, 'm', { replaceItemId: undefined });

  expect(navigateMock).toHaveBeenCalledWith({
    to: ROUTES.products,
  });
});

test('updates cart item in edit mode', async () => {
  searchMock = { mode: 'edit', cartItemId: 's' };

  vi.mocked(fetchProduct).mockResolvedValue({
    pizza_type_id: '1',
    name: 'Pepperoni',
    category: 'Pizza',
    ingredients: 'Cheese, Pepperoni',
    image: '/pepperoni.png',
    items: [
      { pizza_id: 's', size: 'S', price: 10 },
      { pizza_id: 'm', size: 'M', price: 12 },
    ],
  });

  renderWithProviders(<ProductPage />);

  const updateButton = await screen.findByRole('button', {
    name: /update pizza pepperoni in cart/i,
  });

  fireEvent.click(updateButton);

  expect(addToCartMock).toHaveBeenCalledWith(productMock, 's', { replaceItemId: 's' });

  expect(navigateMock).toHaveBeenCalledWith({
    to: ROUTES.cart,
  });
});

test('does not add to cart when no size is selected', async () => {
  vi.mocked(fetchProduct).mockResolvedValue({
    ...productMock,
    items: [],
  });

  renderWithProviders(<ProductPage />);

  const button = await screen.findByText('Add to cart');
  await button.click();

  expect(addToCartMock).not.toHaveBeenCalled();
});

test('renders size selector with correct accessibility attributes', async () => {
  vi.mocked(fetchProduct).mockResolvedValue({
    pizza_type_id: '1',
    name: 'Pepperoni',
    category: 'Pizza',
    ingredients: 'Cheese, Pepperoni',
    image: '/pepperoni.png',
    items: [
      { pizza_id: 's', size: 'S', price: 10 },
      { pizza_id: 'm', size: 'M', price: 12 },
    ],
  });

  renderWithProviders(<ProductPage />);

  const group = await screen.findByRole('group', {
    name: 'Choose pizza size',
  });

  expect(group).toBeTruthy();

  const sizeButton = screen.getByLabelText('Size M, price 12 dollars');
  expect(sizeButton).toBeTruthy();
});
