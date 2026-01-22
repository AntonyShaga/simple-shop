import { createLazyFileRoute } from '@tanstack/react-router';
import CartPage from '../pages/CartPage.tsx';
import { ROUTES } from '../shared/routes.ts';

export const Route = createLazyFileRoute(ROUTES.cart)({
  component: CartPage,
});
