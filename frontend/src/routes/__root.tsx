import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Header } from '../pages/Header.tsx';
import { useState } from 'react';
import type { CartItem } from '../entities/cart';
import { CartContext } from '../entities/cart';
import Footer from '../pages/Footer.tsx';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const cartState = useState<CartItem[]>([]);

  return (
    <CartContext value={cartState}>
      <div className="app-layout">
        <Header />

        <main className="app-main">
          <Outlet />
        </main>

        <Footer />
      </div>

      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </CartContext>
  );
}
