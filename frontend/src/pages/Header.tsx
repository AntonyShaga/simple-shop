import { Link } from '@tanstack/react-router';
import { useCart } from '../entities/cart';
import { ROUTES } from '../shared/routes.ts';
import CartIcon from '../shared/CartIcon.tsx';
import { Modal } from './Modal.tsx';
import { useState } from 'react';
import { NAV_ITEMS } from '../shared/navigation.ts';

export function Header() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav aria-label="Main navigation">
        <ul className="nav-list container">
          <li className="nav-logo">
            <Link to="/" className="logo">
              <img src="/padre_gino.svg" alt="Padre Gino’s" />
            </Link>
          </li>

          <li className="nav-desktop">
            <ul className="nav-list">
              {NAV_ITEMS.map((item) => (
                <li className="nav-menu-item" key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="nav-cart">
            <Link to={ROUTES.cart}>
              <span className="nav-cart-number">{totalItems}</span>
              <CartIcon />
            </Link>
          </li>

          <li className="nav-burger">
            <button
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="burger-button"
            >
              ☰
            </button>
          </li>
        </ul>
      </nav>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <nav aria-label="Mobile navigation" className="mobile-menu">
            <ul className="mobile-menu-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.to} className="mobile-menu-item">
                  <Link to={item.to} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Modal>
      )}
    </header>
  );
}
