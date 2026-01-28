import { useParams } from '@tanstack/react-router';
import { ROUTES } from '../shared/routes.ts';
import { useQuery } from '@tanstack/react-query';
import { fetchOrder } from '../api.ts';
import { API_URL } from '../shared/config.ts';
import { formatDateTime } from '../shared/formatDateTime.ts';

function OrderPage() {
  const { id } = useParams({ from: ROUTES.order });
  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
    enabled: Boolean(id),
  });

  if (isLoading) return <div role="status">Loading...</div>;
  if (error) return <div role="alert">Error: {error.message}</div>;
  if (!data) return <div>Not found</div>;

  return (
    <main aria-labelledby="order-title">
      <div className="container page">
        <h1 id="order-title">Order</h1>

        <section className="order-details" aria-labelledby="order-details-title">
          <h2 id="order-details-title" className="no-flag">
            Order details
          </h2>

          <section className="order-stats">
            <div className="order-stat">
              <span className="order-stat-label">Created</span>
              <strong>{formatDateTime(data.created_at)}</strong>
            </div>

            <div className={`order-stat order-stat--${data.status.toLowerCase()}`}>
              <span className="order-stat-label">Status</span>
              <strong>{data.status}</strong>
            </div>

            <div className="order-stat">
              <span className="order-stat-label">Total</span>
              <strong>${data.total_amount}</strong>
            </div>
          </section>
        </section>

        <section aria-labelledby="order-items-title" className="order-items">
          <h2 id="order-items-title" className="no-flag">
            Items
          </h2>

          <ul className="order-items-list">
            {data.items.map((item) => (
              <li key={item.pizza_id} className="order-item">
                <article className="order-item-card" aria-label={`Pizza ${item.name}`}>
                  <img src={`${API_URL}${item.image}`} alt={`Pizza ${item.name}`} className="order-item-image" />

                  <div className="order-item-body">
                    <h3 className="order-item-title">{item.name}</h3>

                    <div className="order-item-meta">
                      <span>Size: {item.size}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>

                    <div className="order-item-price">
                      <span>
                        ${item.price} × {item.quantity}
                      </span>
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default OrderPage;
