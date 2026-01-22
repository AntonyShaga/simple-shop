import { createFileRoute } from '@tanstack/react-router';
import OrdersPage from '../../pages/OrdersPage.tsx';

export const Route = createFileRoute('/orders/')({
  validateSearch: (search: { page?: number }) => ({
    page: Number(search.page ?? 1),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { page } = Route.useSearch();
  return <OrdersPage page={page} />;
}
