import { useCart } from '../entities/cart';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '../shared/routes.ts';
import { API_URL } from '../shared/config.ts';

const intl = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function CartPage() {
  const { cart, setCart, totalPrice, selectedItems } = useCart();

  const grouped = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    if (!acc[item.pizza_type_id]) acc[item.pizza_type_id] = [];
    acc[item.pizza_type_id].push(item);
    return acc;
  }, {});

  const increase = (pizza_id: string) => {
    setCart((prev) =>
      prev.map((item) => (item.pizza_id === pizza_id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  };

  const decrease = (pizza_id: string) => {
    setCart((prev) =>
      prev
        .map((item) => (item.pizza_id === pizza_id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const remove = (pizza_id: string) => {
    setCart((prev) => prev.filter((item) => item.pizza_id !== pizza_id));
  };

  const setSelected = (pizza_id: string, selected: boolean) => {
    setCart((prev) => prev.map((item) => (item.pizza_id === pizza_id ? { ...item, selected } : item)));
  };

  return (
    <main aria-labelledby="cart-title">
      <div className="container page cart-page">
        <h1 id="cart-title">Cart</h1>

        {!cart.length ? (
          <section className="cart-empty-title" aria-labelledby="cart-empty-title">
            <h2 id="cart-empty-title" className="sr-only no-flag">
              Cart is empty
            </h2>
          </section>
        ) : (
          <div className="cart-layout">
            <section aria-labelledby="cart-items-title" className="cart-items">
              <h2 id="cart-items-title" className="cart-items-title sr-only no-flag">
                Cart items
              </h2>

              <ul>
                {Object.values(grouped).map((items) => {
                  const { pizza_type_id, name } = items[0];

                  return (
                    <li key={pizza_type_id}>
                      <section className="cart-product-group" aria-labelledby={`pizza-group-${pizza_type_id}`}>
                        <h3 className="cart-group-title" id={`pizza-group-${pizza_type_id}`}>
                          {name}
                        </h3>

                        <ul>
                          {items.map((item) => {
                            const subtotal = item.price * item.quantity;

                            return (
                              <li key={item.pizza_id}>
                                <article className="cart-item" aria-labelledby={`item-${item.pizza_id}-title`}>
                                  <div className="cart-item-image">
                                    <img src={`${API_URL}${item.image_url}`} alt={`Pizza ${name}, size ${item.size}`} />
                                  </div>
                                  <div className="cart-item-body">
                                    <h3 id={`item-${item.pizza_id}-title`}>
                                      {item.size} — {intl.format(item.price)}
                                    </h3>

                                    <div className="cart-item-actions">
                                      <Link
                                        to={ROUTES.product}
                                        params={{ id: item.pizza_type_id }}
                                        search={{ mode: 'edit', cartItemId: item.pizza_id }}
                                        className="cart-item-modify"
                                      >
                                        Modify
                                      </Link>
                                    </div>

                                    <div className="cart-item-controls" aria-label="Quantity controls">
                                      <button
                                        type="button"
                                        aria-label={`Decrease quantity of ${name}`}
                                        onClick={() => decrease(item.pizza_id)}
                                      >
                                        −
                                      </button>

                                      <span aria-live="polite">{item.quantity}</span>

                                      <button
                                        type="button"
                                        aria-label={`Increase quantity of ${name}`}
                                        onClick={() => increase(item.pizza_id)}
                                      >
                                        +
                                      </button>

                                      <button
                                        type="button"
                                        className="cart-item-remove"
                                        aria-label={`Remove ${name} from cart`}
                                        onClick={() => remove(item.pizza_id)}
                                      >
                                        Remove
                                      </button>
                                    </div>

                                    <div>
                                      <label className="cart-item-select">
                                        <input
                                          type="checkbox"
                                          checked={item.selected}
                                          onChange={() => setSelected(item.pizza_id, !item.selected)}
                                        />
                                        Select for checkout
                                      </label>
                                    </div>

                                    <p className="cart-item-subtotal">
                                      Subtotal: <strong>{intl.format(subtotal)}</strong>
                                    </p>
                                  </div>
                                </article>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-labelledby="cart-summary-title" className="cart-summary">
              <h2 className="no-flag" id="cart-summary-title">
                Summary
              </h2>

              <p>
                Total: <strong aria-live="polite">{intl.format(totalPrice)}</strong>
              </p>

              <Link to={ROUTES.checkout}>
                <button type="button" aria-label="Proceed to checkout" disabled={selectedItems.length === 0}>
                  Checkout
                </button>
              </Link>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default CartPage;
