import { createLazyFileRoute } from '@tanstack/react-router';
import OrderPage from '../../pages/OrderPage.tsx';
import { ROUTES } from '../../shared/routes.ts';

export const Route = createLazyFileRoute(ROUTES.product)({
  component: OrderPage,
});
