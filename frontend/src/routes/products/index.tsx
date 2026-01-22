import { createFileRoute } from '@tanstack/react-router';
import ProductsPage from '../../pages/ProductsPage.tsx';
import { ROUTES } from '../../shared/routes.ts';

export const Route = createFileRoute(ROUTES.products)({
  validateSearch: (search: { page?: number }) => ({
    page: Number(search.page ?? 1),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { page } = Route.useSearch();
  return <ProductsPage page={page} />;
}
