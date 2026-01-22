import { createLazyFileRoute } from '@tanstack/react-router';
import CheckoutPage from '../../pages/CheckoutPage.tsx';
import { ROUTES } from '../../shared/routes.ts';

export const Route = createLazyFileRoute(ROUTES.checkout)({
  component: CheckoutPage,
});
