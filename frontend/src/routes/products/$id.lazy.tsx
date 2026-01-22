import { createLazyFileRoute } from '@tanstack/react-router';
import ProductPage from '../../pages/ProductPage.tsx';
import { ROUTES } from '../../shared/routes.ts';

export const Route = createLazyFileRoute(ROUTES.product)({
  component: ProductPage,
});
