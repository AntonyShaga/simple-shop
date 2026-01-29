import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../api.ts';
import { useState } from 'react';
import { ROUTES } from '../shared/routes.ts';
import { Route } from '../routes/products/$id.lazy.tsx';
import { API_URL } from '../shared/config.ts';
import { useAddToCart } from '../entities/cart/useAddToCart.ts';

function ProductPage() {
  const { id } = useParams({ from: ROUTES.product });
  const navigate = useNavigate();

  const { mode, cartItemId } = Route.useSearch() as {
    mode?: 'edit';
    cartItemId?: string;
  };
  const isEditMode = mode === 'edit';

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });

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

  const handleAddToCart = () => {
    if (!data || !effectiveSelectedId) return;

    addToCart(data, effectiveSelectedId, {
      replaceItemId: isEditMode ? cartItemId : undefined,
    });

    void navigate({ to: isEditMode ? ROUTES.cart : ROUTES.products });
  };

  if (isLoading) return <div role="status">Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <main>
      <section className="container page product-page">
        <div className="product-meta">
          <h1>{data.name}</h1>
          <p className="product-category">
            <strong>Category:</strong>
            {data.category}
          </p>

          <p className="product-ingredients">
            <strong>Ingredients:</strong> {data.ingredients}
          </p>
        </div>
        <div className="product-media">
          <img className="product-image" src={`${API_URL}${data.image}`} alt={`Pizza ${data.name}`} />
        </div>
        <div className="product-purchase">
          <div className="product-variants" role="group" aria-label="Choose pizza size">
            {data.items.map((item) => (
              <button
                type="button"
                aria-label={`Size ${item.size}, price ${item.price} dollars`}
                aria-pressed={effectiveSelectedId === item.pizza_id}
                key={item.pizza_id}
                onClick={() => setSelectedId(item.pizza_id)}
              >
                {item.size} — ${item.price}
              </button>
            ))}
          </div>

          <nav className="page-actions" aria-label="Product actions">
            <button
              aria-label={isEditMode ? `Update pizza ${data.name} in cart` : `Add pizza ${data.name} to cart`}
              onClick={handleAddToCart}
            >
              {isEditMode ? 'Update order' : 'Add to cart'}
            </button>

            <Link className="back-link" to={ROUTES.products} aria-label="Back to products list">
              Back to products
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}

export default ProductPage;
