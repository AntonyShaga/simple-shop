import { API_URL } from '../shared/config.ts';
import { Link, useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../shared/routes.ts';
import { createOrder } from '../api.ts';
import { CreateOrderSchema } from '@simple-shop/shared';
import React from 'react';
import { useCart } from '../entities/cart';
import { currencyFormatters } from '../shared/currencyFormatters.ts';

function CheckoutPage() {
  const { selectedItems, setCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      items: selectedItems.map((item) => ({
        pizzaId: item.pizza_id,
        quantity: item.quantity,
      })),
    };

    const parsed = CreateOrderSchema.safeParse(payload);
    if (!parsed.success) {
      alert('Invalid orders data');
      return;
    }

    try {
      await createOrder(parsed.data);
      setCart((prev) => prev.filter((item) => !item.selected));
      void navigate({ to: ROUTES.cart });
    } catch {
      alert('Order failed');
    }
  };

  return (
    <main aria-labelledby="checkout-title">
      <div className="container page">
        <h1 id="checkout-title">Checkout</h1>

        <form onSubmit={handleSubmit} className="checkout-form" aria-describedby="checkout-description">
          <section aria-labelledby="checkout-items-title">
            <h2 className="no-flag" id="checkout-items-title">
              Order items
            </h2>

            <ul className="order-items-list">
              {selectedItems.map((item) => (
                <li key={item.pizza_id} className="order-item">
                  <article className="order-item-card" aria-label={`Pizza ${item.name}`}>
                    <img src={`${API_URL}${item.image_url}`} alt={`Pizza ${item.name}`} className="order-item-image" />

                    <div className="order-item-body">
                      <h3 className="order-item-title">{item.name}</h3>

                      <div className="order-item-meta">
                        <span>Size: {item.size}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="order-item-price">
                        <strong>{currencyFormatters.usd.format(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <section className="page-actions" aria-label="Checkout actions">
            <button type="submit">Confirm order</button>
            <Link className="back-link" type="button" to={ROUTES.cart}>
              Back to cart
            </Link>
          </section>
        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;
