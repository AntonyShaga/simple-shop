import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPizzaOfTheDay } from '../api.ts';
import { API_URL } from '../shared/config.ts';
import { useAddToCart } from '../entities/cart/useAddToCart.ts';
import { ROUTES } from '../shared/routes.ts';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['pizza-of-the-day'],
    queryFn: fetchPizzaOfTheDay,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const navigate = useNavigate();

  const { mode, cartItemId } = Route.useSearch() as {
    mode?: 'edit';
    cartItemId?: string;
  };
  const isEditMode = mode === 'edit';

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const defaultSelectedId = (() => {
    if (!data) return null;

    if (isEditMode && cartItemId) {
      return cartItemId;
    }

    return data.items.find((i) => i.size === 'M')?.pizza_id ?? data.items[0]?.pizza_id ?? null;
  })();

  const effectiveSelectedId = selectedId ?? defaultSelectedId;

  const addToCart = useAddToCart();

  const handleAddToCart = (id: string) => {
    if (!data || !effectiveSelectedId) return;
    setSelectedId(id);
    addToCart(data, effectiveSelectedId, {
      replaceItemId: isEditMode ? cartItemId : undefined,
    });
  };

  if (isLoading || isFetching) return <div role="status">Loading...</div>;
  if (error) return <div role="alert">Failed to load.</div>;
  if (!data) return <div role="alert">Not found.</div>;

  return (
    <main className="featured-product" aria-labelledby="featured-title">
      <section className="featured-hero container page" aria-labelledby="featured-title">
        <div className="featured-header">
          <h1 id="featured-title" className="featured-title">
            Pizza of the Day
          </h1>
          <span className="featured-badge">Today’s special</span>
        </div>

        <div className="featured-layout">
          <figure className="featured-media">
            <img className="featured-image" src={`${API_URL}${data.image}`} alt={data.name} loading="eager" />
          </figure>

          <div className="featured-details" aria-label="Pizza details">
            <h2 className="featured-name no-flag">{data.name}</h2>

            <p className="featured-ingredients">{data.ingredients}</p>

            <p className="featured-category">
              <span className="featured-category-label">Category:</span>{' '}
              <span className="featured-category-value">{data.category}</span>
            </p>

            <section className="featured-variants" aria-labelledby="variants-title">
              <h3 id="variants-title" className="sr-only">
                Available sizes
              </h3>

              <ul className="variant-list">
                {data.items.map((item) => (
                  <li key={item.pizza_id} className="variant-row">
                    <span className="variant-size">{item.size}</span>
                    <span className="variant-price">${Number(item.price).toFixed(2)}</span>

                    <button
                      type="button"
                      className="variant-add"
                      aria-label={`Size ${item.size}, price ${item.price} dollars`}
                      aria-pressed={effectiveSelectedId === item.pizza_id}
                      onClick={() => handleAddToCart(item.pizza_id)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <div className="featured-actions" aria-label="Primary actions">
              <button
                type="button"
                className="featured-primary-action"
                onClick={() => {
                  void navigate({ to: isEditMode ? ROUTES.cart : ROUTES.products });
                }}
              >
                View product →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Index;
