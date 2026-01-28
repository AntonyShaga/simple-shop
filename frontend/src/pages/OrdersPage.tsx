import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../api.ts';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '../shared/routes.ts';
import Loader from './Loader.tsx';
import { formatDateTime } from '../shared/formatDateTime.ts';

type Props = {
  page: number;
};
function OrdersPage({ page }: Props) {
  const { data, error, isFetching } = useQuery({
    queryKey: ['orders', page],
    placeholderData: (previousData) => previousData,
    queryFn: () => fetchOrders(page),
    staleTime: 30_000,
  });

  if (error) return <div role="alert">Error: {error.message}</div>;
  if (!data) return null;

  return (
    <main>
      <section className="container page">
        <h1 id="orders-title">Orders</h1>
        <div className="page-content">
          <ul className="list-grid list-grid--orders" aria-labelledby="orders-title">
            {data?.data.map((order) => (
              <li key={order.id}>
                <article className="card" aria-label={`Order ${order.id}`}>
                  <Link className="card-order" to={ROUTES.order} params={{ id: order.id }}>
                    <p>{order.status}</p>
                    <p>{order.total_amount}</p>
                    <p>{formatDateTime(order.created_at)}</p>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
          <Loader active={isFetching} />
        </div>
      </section>
      <nav className="pagination" aria-label="Orders pagination">
        <Link
          className="pagination-button"
          to={ROUTES.orders}
          search={{ page: page - 1 }}
          disabled={page <= 1}
          aria-disabled={page <= 1}
          aria-label="Previous orders page"
        >
          Prev
        </Link>

        <span className="pagination-page" aria-current="page">
          Page {page}
        </span>

        <Link
          className="pagination-button"
          to={ROUTES.orders}
          search={{ page: page + 1 }}
          disabled={data.data.length < data.limit}
          aria-disabled={data.data.length < data.limit}
          aria-label="Next orders page"
        >
          Next
        </Link>
      </nav>
    </main>
  );
}

export default OrdersPage;
